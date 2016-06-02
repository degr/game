package org.forweb.commandos.service;

import org.forweb.commandos.dao.MapDao;
import org.forweb.commandos.database.Db;
import org.forweb.commandos.database.Row;
import org.forweb.commandos.database.Table;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.ZoneDto;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MapService {

    @Autowired
    MapDao mapDao;

    @PostConstruct
    public void postConstruct() {
        List<Map> maps = mapDao.findAll();
        System.out.println(maps);
    }

    public String saveMap(GameMap map) throws NoSuchAlgorithmException {
        if (map.getName() == null || "".equals(map.getName())) {
            return "-1";
        }
        int maxPlayers = 0;
        for (ZoneDto zone : map.getZonesDto()) {
            if (Respawn.TITLE.equals(zone.getType())) {
                maxPlayers++;
            }
        }
        if (maxPlayers < 2) {
            return "-1";
        }

        Integer mapId = null;
        if(map.getMapHash() != null) {
            mapId = findMapIdByHash(map.getMapHash());
        }
        if(mapId == null) {
            mapId = saveMapGeneral(map, maxPlayers);
        }
        saveMapZones(map.getZonesDto(), mapId);
        String mapHash = md5Custom(String.valueOf(mapId + "_" + System.currentTimeMillis()));
        String query = "update map set map_hash = ? where id = ?";
        Db db = new Db();
        db.query(query, mapHash, mapId);
        return mapHash;
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
    private Integer findMapIdByHash(String hash) {
        Db db = new Db();
        String query = "Select id from map where hash = ?";
        return db.getCellInt(query, hash);
    }

    private void saveMapZones(List<ZoneDto> zones, Integer mapId) {
        Db db = new Db();
        String deleteQuery = "delete from zone where map = ?";
        db.query(deleteQuery, mapId);

        String query = "insert into zone (type, x, y, width, height, map) values (?, ?, ?, ?, ?, ?)";
        for (ZoneDto zone : zones) {
            db.query(query, zone.getType(), zone.getX(), zone.getY(), zone.getWidth(), zone.getHeight(), mapId);
        }
    }

    private Integer saveMapGeneral(GameMap map, Integer maxPlayers) {
        Db db = new Db();
        String query = "insert into map (title, x, y, max_players) values (?, ?, ?, ?)";
        db.query(query, map.getName(), map.getX(), map.getY(), maxPlayers);
        return db.getCellInt("select max(id) from map");
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
        String query = "select * from map ";
        Object [] params;
        if(mapId == null) {
            page = (page - 1) * size;
            if (mapName != null && !"".equals(mapName)) {
                query += "where title like ? ";
                params = new Object[3];
                params[0] = mapName + "%";
                params[1] = page;
                params[2] = size;
            } else {
                params = new Object[2];
                params[0] = page;
                params[1] = size;
            }
            query += "limit ?, ?";
        } else {
            query += "where id = ?";
            params = new Object[1];
            params[0] = mapId;
        }
        Db db = new Db();
        Table table = db.getTable(query, params);
        List<GameMap> out = new ArrayList<>(table.size());
        List<Integer> mapIds = new ArrayList<>();
        for(Row row : table) {
            Integer id = row.getInt("id");
            mapIds.add(id);
            GameMap map = new GameMap();
            map.setId(id);
            map.setX(row.getInt("x"));
            map.setY(row.getInt("y"));
            map.setMaxPlayers(row.getInt("max_players"));
            map.setGameType(row.get("game_type"));
            map.setName(row.get("title"));
            map.setRating(row.get("rating"));
            out.add(map);
        }
        if(mapIds.size() > 0) {
            query = "select * from zone where map in (" +
                    mapIds.stream().map(v -> "?").collect(Collectors.joining(",")) + ")";
            Table zones = db.getTable(query, mapIds.toArray());
            for (Row row : zones) {
                for (GameMap map : out) {
                    if (!map.getId().equals(row.getInt("map"))) {
                        continue;
                    }
                    if (map.getZones() == null) {
                        map.setZones(new ArrayList<>());
                    }
                    AbstractZone zone = getZone(row);
                    if (zone != null) {
                        map.getZones().add(zone);
                    }
                }
            }
        }
        return out;
    }

    private AbstractZone getZone(Row row) {
        AbstractZone zone;
        Integer x = row.getInt("x"), y = row.getInt("y"), id = row.getInt("id");
        switch (row.get("type")) {
            case "shotgun":
                zone = new ShotgunZone(x, y, id);
                break;
            case "assault":
                zone = new AssaultZone(x, y, id);
                break;
            case "sniper":
                zone = new SniperZone(x, y, id);
                break;
            case "minigun":
                zone = new MinigunZone(x, y, id);
                break;
            case "rocket":
                zone = new RocketZone(x, y, id);
                break;
            case "flame":
                zone = new FlameZone(x, y, id);
                break;
            case "medkit":
                zone = new MedkitZone(x, y, id);
                break;
            case "armor":
                zone = new ArmorZone(x, y, id);
                break;
            case "helm":
                zone = new HelmZone(x, y, id);
                break;
            case "respawn":
                zone = new Respawn(x, y);
                break;
            case "wall":
                zone = new Wall(x, y, row.getInt("width"), row.getInt("height"));
                break;
            default:
                System.out.println("Unknown zone type: " + row.get("type"));
                zone = null;
        }
        return zone;
    }


    public Boolean nameEmpty(String name) {
        Db db = new Db();
        Integer out = db.getCellInt("select id from map where title = ?", name);
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
}
