package org.forweb.commandos.service;

import org.forweb.commandos.dao.MapDao;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.interactive.RespawnBlue;
import org.forweb.commandos.entity.zone.interactive.RespawnRed;
import org.forweb.database.AbstractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class MapService extends AbstractService<Map, MapDao> {

    @Autowired
    private ZoneService zoneService;

    public String saveMap(GameMap dto) throws NoSuchAlgorithmException {
        if (dto.getName() == null || "".equals(dto.getName())) {
            return "-1";
        }
        int maxPlayers = 0;
        int bluePlayers = 0;
        int redPlayers = 0;
        boolean coOpRespawns = Map.GameType.ctf.toString().equals(dto.getGameType());
        for (int i = dto.getZonesDto().size() - 1; i >= 0; i--) {
            Zone zone = dto.getZonesDto().get(i);
            if (coOpRespawns) {
                if (RespawnBlue.TITLE.equals(zone.getType())) {
                    bluePlayers++;
                } else if (RespawnRed.TITLE.equals(zone.getType())) {
                    redPlayers++;
                } else if (Respawn.TITLE.equals(zone.getType())) {
                    dto.getZonesDto().remove(i);
                }
            } else {
                if (Respawn.TITLE.equals(zone.getType())) {
                    maxPlayers++;
                } else if (RespawnBlue.TITLE.equals(zone.getType()) || RespawnRed.TITLE.equals(zone.getType())) {
                    dto.getZonesDto().remove(i);
                }
            }
        }
        if (coOpRespawns) {
            if (bluePlayers == 0 || redPlayers == 0) {
                return "-1";
            }
            maxPlayers = bluePlayers + redPlayers;
        }
        if (maxPlayers < 2) {
            return "-1";
        }

        Map map;
        if (dto.getMapHash() != null) {
            map = findMapByHash(dto.getMapHash());
        } else {
            map = new Map();
        }
        map = saveMapGeneral(map, dto, maxPlayers);
        saveMapZones(map, dto.getZonesDto());
        if (map.getMapHash() == null) {
            map.setMapHash(md5Custom(String.valueOf(map.getId() + "_" + System.currentTimeMillis())));
            save(map);
        }
        return map.getMapHash();
    }

    private static String md5Custom(String st) {
        MessageDigest messageDigest;
        byte[] digest = new byte[0];
        try {
            messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.reset();
            messageDigest.update(st.getBytes());
            digest = messageDigest.digest();
        } catch (NoSuchAlgorithmException e) {
            // тут можно обработать ошибку
            // возникает она если в передаваемый алгоритм в getInstance(,,,) не существует
            e.printStackTrace();
        }

        BigInteger bigInt = new BigInteger(1, digest);
        String md5Hex = bigInt.toString(16);

        while (md5Hex.length() < 32) {
            md5Hex = "0" + md5Hex;
        }

        return md5Hex;
    }

    private Map findMapByHash(String hash) {
        return dao.findMapByMapHash(hash);
    }

    private void saveMapZones(Map map, List<Zone> zones) {
        zoneService.deleteAllForMap(map.getId());
        for (Zone zone : zones) {
            zone.setMap(map.getId());
        }
        zoneService.save(zones);
    }

    private Map saveMapGeneral(Map map, GameMap dto, Integer maxPlayers) {
        map.setTitle(dto.getName());
        map.setX(dto.getX());
        map.setY(dto.getY());
        map.setGameType(dto.getGameType() != null ? Map.GameType.valueOf(dto.getGameType()) : null);
        map.setMaxPlayers(maxPlayers);
        map.setRating(0);
        return save(map);
    }

    GameMap loadMap(Integer mapId) {
        List<GameMap> maps = loadMaps(null, null, null, mapId);
        if (maps.size() > 0) {
            return maps.get(0);
        } else {
            return null;
        }
    }

    public List<GameMap> loadMaps(String mapName, Integer page, Integer size) {
        return loadMaps(mapName, page, size, null);
    }

    private List<GameMap> loadMaps(String mapName, Integer page, Integer size, Integer mapId) {
        List<Map> maps;
        if (mapId == null) {
            page = (page - 1) * size;
            if (mapName != null && !"".equals(mapName)) {
                maps = dao.findMapsForPage(mapName + "%", page, size);
            } else {
                maps = dao.findMapsForPage(page, size);
            }
        } else {
            maps = new ArrayList<>(1);
            maps.add(findOne(mapId));
        }

        List<GameMap> out = new ArrayList<>(maps.size());
        List<Integer> mapIds = new ArrayList<>();
        for (Map row : maps) {
            Integer id = row.getId();
            mapIds.add(id);
            GameMap map = new GameMap();
            map.setId(id);
            map.setX(row.getX());
            map.setY(row.getY());
            map.setMaxPlayers(row.getMaxPlayers());
            map.setGameType(row.getGameType() != null ? row.getGameType().toString() : null);
            map.setName(row.getTitle());
            map.setRating(row.getRating());
            out.add(map);
        }
        HashMap<Integer, List<AbstractZone>> zones = zoneService.findZonesforMaps(mapIds);
        out.stream().
                filter(map -> zones.containsKey(map.getId())).
                forEach(map -> map.setZones(zones.get(map.getId())));
        return out;
    }


    public Boolean nameEmpty(String name) {
        Map out = dao.findMapByTitle(name);
        return out == null;
    }

    void onItemsLifecycle(List<AbstractZone> zones) {
        zones.stream()
                .filter(zone -> zone instanceof AbstractItem)
                .forEach(zone -> {
                        AbstractItem item = (AbstractItem) zone;
                        if (!item.isAvailable() && item.getTimeout() < System.currentTimeMillis()) {
                            item.setAvailable(true);
                        }
                });
    }

    public GameMap loadMapByHash(String mapHash) {
        Map map = findMapByHash(mapHash);
        if (map != null) {
            GameMap out = new GameMap();
            out.setId(map.getId());
            out.setName(map.getTitle());
            out.setRating(map.getRating());
            out.setMaxPlayers(map.getMaxPlayers());
            out.setGameType(map.getGameType() != null ? map.getGameType().toString() : Map.GameType.dm.toString());
            out.setMapHash(mapHash);
            out.setX(map.getX());

            out.setY(map.getY());
            out.setZones(zoneService.getZonesFormMap(map.getId()));
            return out;
        } else {
            return null;
        }
    }
}
