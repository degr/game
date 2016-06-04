package org.forweb.commandos.service;

import org.forweb.commandos.dao.TileDao;
import org.forweb.commandos.dao.ZoneDao;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.commandos.entity.zone.walls.TiledZone;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.forweb.database.AbstractService;
import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.criteria.CriteriaBuilder;
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

    @Autowired private TileDao tileDao;

    public boolean createCustomTile(String title, Integer width, Integer height, MultipartFile file) {
        try {
            Tile zone = new Tile();
            zone.setWidth(width);
            zone.setHeight(height);
            zone.setTitle(title);
            tileDao.save(zone);

            String[] name = file.getOriginalFilename().trim().split("\\.");
            String ext =  name[name.length - 1];
            if(!isImage(ext)) {
                throw new RuntimeException("File must be an image with extension png, jpg, gif, jpeg.");
            }
            String filename = zone.getId() + "." + name[name.length - 1];
            zone.setImage(filename);
            tileDao.save(zone);
            File dir = new File(ROOT + "/images/zones/");
            if(!dir.isDirectory() && !dir.mkdirs()) {
                throw new RuntimeException("Can't create folder for images store.");
            }

            BufferedOutputStream stream = new BufferedOutputStream(
                    new FileOutputStream(new File(ROOT + "/images/zones/" + filename)));
            FileCopyUtils.copy(file.getInputStream(), stream);
            stream.close();
            return true;
        }
        catch (Exception e) {
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
        HashMap<Integer, List<AbstractZone>> zones = findZonesforMaps(new ArrayList<Integer>(1){{
            add(id);
        }});
        return zones.containsKey(id) ? zones.get(id) : null;
    }


    public AbstractZone getZone(Zone zone, Tile tile) {
        AbstractZone out;
        Integer x = zone.getX(), y = zone.getY(), id = zone.getId();
        switch (zone.getType()) {
            case "shotgun":
                out = new ShotgunZone(x, y, id);
                break;
            case "assault":
                out = new AssaultZone(x, y, id);
                break;
            case "sniper":
                out = new SniperZone(x, y, id);
                break;
            case "minigun":
                out = new MinigunZone(x, y, id);
                break;
            case "rocket":
                out = new RocketZone(x, y, id);
                break;
            case "flame":
                out = new FlameZone(x, y, id);
                break;
            case "medkit":
                out = new MedkitZone(x, y, id);
                break;
            case "armor":
                out = new ArmorZone(x, y, id);
                break;
            case "helm":
                out = new HelmZone(x, y, id);
                break;
            case "respawn":
                out = new Respawn(x, y);
                break;
            case "wall":
                out = new Wall(x, y, zone.getWidth(), zone.getHeight());
                break;
            case "tiled":
                if(tile != null) {
                    out = new TiledZone(x, y, tile);
                } else {
                    out = new Wall(x, y, zone.getWidth(), zone.getHeight());
                }
                break;
            default:
                System.out.println("Unknown zone type: " + zone.getType());
                out = null;
        }
        return out;
    }

    public HashMap<Integer, List<AbstractZone>> findZonesforMaps(List<Integer> mapIds) {
        HashMap<Integer, List<AbstractZone>> out = new HashMap<>(mapIds.size());

        List<Zone> zones = dao.findAllZonesForMaps(mapIds);
        List<Integer> integ = zones.stream()
                .filter(v -> "tiled".equals(v.getType()) && v.getTile() != null)
                .map(Zone::getTile)
                .collect(Collectors.toList());
        List<Tile> tiles = integ.size() > 0 ? tileDao.findAll(integ) : null;
        for(Zone zone : zones) {
            Tile tile = null;
            if(tiles != null) {
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
            if(!out.containsKey(zone.getMap())) {
                List<AbstractZone> list = new ArrayList<>();
                list.add(entity);
                out.put(zone.getMap(), list);
            } else {
                out.get(zone.getMap()).add(entity);
            }
        }
        return  out;
    }
}
