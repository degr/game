package org.forweb.commandos.service;

import org.forweb.commandos.AppInitializer;
import org.forweb.commandos.dao.TileDao;
import org.forweb.commandos.dao.ZoneDao;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.commandos.entity.zone.interactive.*;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.commandos.entity.zone.walls.TiledZone;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.forweb.database.AbstractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static org.forweb.commandos.AppInitializer.ROOT;

@Service
public class ZoneService extends AbstractService<Zone, ZoneDao> {

    @Autowired
    private TileDao tileDao;

    public boolean createCustomTile(String title, Integer width, Integer height, Boolean isTileSet, MultipartFile file) {
        try {
            Tile tile = new Tile();
            tile.setWidth(width);
            tile.setHeight(height);
            tile.setTitle(title);
            tile.setTileset(isTileSet);
            tileDao.save(tile);

            String[] name = file.getOriginalFilename().trim().split("\\.");
            String ext = name[name.length - 1];
            if (!isImage(ext)) {
                tileDao.delete(tile);
                throw new RuntimeException("File must be an image with extension png, jpg, gif, jpeg.");
            }
            String filename = tile.getId() + "." + name[name.length - 1];
            tile.setImage(filename);
            tileDao.save(tile);
            String dirStr = ROOT + (AppInitializer.DEV ? "/" : "/../upload.") + "images/zones/";
            File dir = new File(dirStr);
            if (!dir.isDirectory() && !dir.mkdirs()) {
                tileDao.delete(tile);
                throw new RuntimeException("Can't create folder for images store.");
            }

            BufferedOutputStream stream = new BufferedOutputStream(
                    new FileOutputStream(new File(dirStr + filename)));
            FileCopyUtils.copy(file.getInputStream(), stream);
            stream.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean isImage(String extension) {
        switch (extension) {
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
                return true;
            default:
                return false;
        }
    }

    public List<Tile> getAllTiles() {
        return tileDao.findAll();
    }

    public void deleteAllForMap(Integer id) {
        dao.deleteAllForMap(id);
    }

    public List<Zone> findAllZonesForMaps(List<Integer> mapIds) {
        return dao.findAllZonesForMaps(mapIds);
    }

    public List<AbstractZone> getZonesFormMap(Integer id) {
        HashMap<Integer, List<AbstractZone>> zones = findZonesforMaps(new ArrayList<Integer>(1) {{
            add(id);
        }});
        return zones.containsKey(id) ? zones.get(id) : null;
    }


    public AbstractZone getZone(Zone zone, Tile tile) {
        AbstractZone out;
        Integer x = zone.getX(),
                y = zone.getY(),
                id = zone.getId();
        Float angle = zone.getAngle();
        if (angle == null) {
            angle = 0F;
        }
        switch (zone.getType()) {
            case ShotgunZone.TITLE:
                out = new ShotgunZone(x, y, id, angle);
                break;
            case AssaultZone.TITLE:
                out = new AssaultZone(x, y, id, angle);
                break;
            case SniperZone.TITLE:
                out = new SniperZone(x, y, id, angle);
                break;
            case MinigunZone.TITLE:
                out = new MinigunZone(x, y, id, angle);
                break;
            case RocketZone.TITLE:
                out = new RocketZone(x, y, id, angle);
                break;
            case FlameZone.TITLE:
                out = new FlameZone(x, y, id, angle);
                break;
            case MedkitZone.TITLE:
                out = new MedkitZone(x, y, id, angle);
                break;
            case ArmorZone.TITLE:
                out = new ArmorZone(x, y, id, angle);
                break;
            case HelmZone.TITLE:
                out = new HelmZone(x, y, id, angle);
                break;
            case Respawn.TITLE:
                out = new Respawn(x, y, id, angle);
                break;
            case RespawnBlue.TITLE:
                out = new RespawnBlue(x, y, id, angle);
                break;
            case RespawnRed.TITLE:
                out = new RespawnRed(x, y, id, angle);
                break;
            case FlagBlue.TITLE:
                out = new FlagBlue(x, y, id, angle);
                break;
            case FlagRed.TITLE:
                out = new FlagRed(x, y, id, angle);
                break;
            case Wall.TITLE:
                out = new Wall(x, y, zone.getWidth(), zone.getHeight(), angle);
                if (Boolean.TRUE.equals(zone.isPassable())) {
                    out.setPassable(true);
                }
                if (Boolean.TRUE.equals(zone.getShootable())) {
                    out.setShootable(true);
                }
                break;
            case TiledZone.TITLE:
                if (tile != null) {
                    out = new TiledZone(x, y, zone, tile, angle);
                } else {
                    out = new Wall(x, y, zone.getWidth(), zone.getHeight(), angle);
                }
                if (Boolean.TRUE.equals(zone.isPassable())) {
                    out.setPassable(true);
                }
                if (Boolean.TRUE.equals(zone.getShootable())) {
                    out.setShootable(true);
                }
                break;
            default:
                System.out.println("Unknown zone type: " + zone.getType());
                out = null;
        }
        return out;
    }

    public HashMap<Integer, List<AbstractZone>> findZonesforMaps(List<Integer> mapIds) {
        int size = mapIds.size();
        HashMap<Integer, List<AbstractZone>> out = new HashMap<>(size);
        if (size == 0) {
            return out;
        }

        List<Zone> zones = dao.findAllZonesForMaps(mapIds);
        List<Integer> integ = zones.stream()
                .filter(v -> "tiled".equals(v.getType()) && v.getTile() != null)
                .map(Zone::getTile)
                .collect(Collectors.toList());
        List<Tile> tiles = integ.size() > 0 ? tileDao.findAll(integ) : null;
        for (Zone zone : zones) {
            Tile tile = null;
            if (tiles != null) {
                if ("tiled".equals(zone.getType())) {
                    for (Tile item : tiles) {
                        if (item.getId().equals(zone.getTile())) {
                            tile = item;
                            break;
                        }
                    }
                }
            }
            AbstractZone entity = getZone(zone, tile);
            if (!out.containsKey(zone.getMap())) {
                List<AbstractZone> list = new ArrayList<>();
                list.add(entity);
                out.put(zone.getMap(), list);
            } else {
                out.get(zone.getMap()).add(entity);
            }
        }
        return out;
    }

    public void replaceToWall(Tile tile) {
        dao.replaceToWall(tile.getId());
    }

    public void deleteTile(Tile tile) {
        tileDao.delete(tile);
    }
}
