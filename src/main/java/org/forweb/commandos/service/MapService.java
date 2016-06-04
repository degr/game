package org.forweb.commandos.service;

import org.forweb.commandos.dao.MapDao;
import org.forweb.commandos.dao.ZoneDao;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.forweb.database.AbstractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MapService extends AbstractService<Map, MapDao> {

    @Autowired
    private ZoneService zoneService;

    @PostConstruct
    public void postConstruct() {
        List<Map> maps = findAll();
        System.out.println(maps);
    }

    public String saveMap(GameMap dto) throws NoSuchAlgorithmException {
        if (dto.getName() == null || "".equals(dto.getName())) {
            return "-1";
        }
        int maxPlayers = 0;
        for (Zone zone : dto.getZonesDto()) {
            if (Respawn.TITLE.equals(zone.getType())) {
                maxPlayers++;
            }
        }
        if (maxPlayers < 2) {
            return "-1";
        }

        Map map;
        if(dto.getMapHash() != null) {
            map = findMapByHash(dto.getMapHash());
        } else {
            map = new Map();
        }
        map = saveMapGeneral(map, dto, maxPlayers);
        saveMapZones(map, dto.getZonesDto());
        if(map.getMapHash() == null) {
            map.setMapHash(md5Custom(String.valueOf(map.getId() + "_" + System.currentTimeMillis())));
            save(map);
        }
        return map.getMapHash();
    }
    public static String md5Custom(String st) {
        MessageDigest messageDigest = null;
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

        while( md5Hex.length() < 32 ){
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

    public GameMap loadMap(Integer mapId) {
        List<GameMap> maps = loadMaps(null, null, null, mapId);
        if(maps.size() > 0) {
            return maps.get(0);
        } else {
            return null;
        }
    }
    public List<GameMap> loadMaps(String mapName, Integer page, Integer size) {
        return loadMaps(mapName, page, size, null);
    }

    public List<GameMap> loadMaps(String mapName, Integer page, Integer size, Integer mapId) {

        List<Map> maps;
        if(mapId == null) {
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
        for(Map row : maps) {
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
        for(GameMap map : out) {
            if(zones.containsKey(map.getId())) {
                map.setZones(zones.get(map.getId()));
            }
        }
        return out;
    }



    public Boolean nameEmpty(String name) {
        Map out = dao.findMapByTitle(name);
        return out == null;
    }

    public void onItemsLifecycle(List<AbstractZone> zones) {
        for(AbstractZone zone : zones) {
            if(zone instanceof AbstractItem) {
                AbstractItem item = (AbstractItem) zone;
                if(!item.isAvailable() && item.getTimeout() < System.currentTimeMillis()) {
                    item.setAvailable(true);
                }
            }
        }
    }

    public GameMap loadMapByHash(String mapHash) {
        Map map = findMapByHash(mapHash);
        if(map != null) {
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
