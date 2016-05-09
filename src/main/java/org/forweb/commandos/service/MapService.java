package org.forweb.commandos.service;

import org.forweb.commandos.database.Db;
import org.forweb.commandos.database.Row;
import org.forweb.commandos.database.Table;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.ZoneDto;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MapService {

    @Autowired
    private Db db;

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
        Integer mapId = saveMapGeneral(map, maxPlayers);
        saveMapZones(map.getZonesDto(), mapId);
        return Arrays.toString(
                MessageDigest.getInstance("MD5").
                        digest(String.valueOf(mapId + System.currentTimeMillis()).getBytes())
        );
    }


    private void saveMapZones(List<ZoneDto> zones, Integer mapId) {
        String deleteQuery = "delete from zone where map = ?";
        db.query(deleteQuery, mapId);

        String query = "insert into zone (type, x, y, width, height, map) values (?, ?, ?, ?, ?, ?)";
        for (ZoneDto zone : zones) {
            db.query(query, zone.getType(), zone.getX(), zone.getY(), zone.getWidth(), zone.getHeight(), mapId);
        }
    }

    private Integer saveMapGeneral(GameMap map, Integer maxPlayers) {
        String query = "insert into map (title, x, y, max_players) values (?, ?, ?, ?)";
        db.query(query, map.getName(), map.getX(), map.getY(), maxPlayers);
        return db.getCellInt("select max(id) from map");
    }

    public List<GameMap> loadMaps(String mapName, Integer page, Integer size) {
        String query = "select * from map ";
        Object [] params;
        page = (page - 1) * size;
        if(mapName != null && !"".equals(mapName)) {
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
        query = "select * from zone where map in (" +
                mapIds.stream().map(v -> "?").collect(Collectors.joining(",")) + ")";
        Table zones = db.getTable(query, mapIds.toArray());
        for(Row row : zones) {
            for(GameMap map : out) {
                if(!map.getId().equals(row.getInt("map"))) {
                    continue;
                }
                if(map.getZones() == null) {
                    map.setZones(new ArrayList<>());
                }
                AbstractZone zone = getZone(row);
                if(zone != null) {
                    map.getZones().add(zone);
                }
            }
        }
        return out;
    }

    private AbstractZone getZone(Row row) {
        AbstractZone zone;
        switch (row.get("type")) {
            case "shotgun":
                zone = new ShotgunZone(row.getInt("x"), row.getInt("y"));
                break;
            case "assault":
                zone = new AssaultZone(row.getInt("x"), row.getInt("y"));
                break;
            case "sniper":
                zone = new SniperZone(row.getInt("x"), row.getInt("y"));
                break;
            case "minigun":
                zone = new MinigunZone(row.getInt("x"), row.getInt("y"));
                break;
            case "rocket":
                zone = new RocketZone(row.getInt("x"), row.getInt("y"));
                break;
            case "flame":
                zone = new FlameZone(row.getInt("x"), row.getInt("y"));
                break;
            case "medkit":
                zone = new MedkitZone(row.getInt("x"), row.getInt("y"));
                break;
            case "armor":
                zone = new ArmorZone(row.getInt("x"), row.getInt("y"));
                break;
            case "helm":
                zone = new HelmZone(row.getInt("x"), row.getInt("y"));
                break;
            case "respawn":
                zone = new Respawn(row.getInt("x"), row.getInt("y"));
                break;
            case "wall":
                zone = new Wall(row.getInt("x"), row.getInt("y"), row.getInt("width"), row.getInt("height"));
                break;
            default:
                System.out.println("Unknown zone type: " + row.get("type"));
                zone = null;
        }
        return zone;
    }


    public Boolean nameEmpty(String name) {
        Integer out = db.getCellInt("select id from map where title = ?", name);
        return out == null;
    }
}
