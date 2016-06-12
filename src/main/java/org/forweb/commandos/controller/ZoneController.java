package org.forweb.commandos.controller;

import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.commandos.entity.zone.interactive.*;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.commandos.entity.zone.walls.TiledZone;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.service.MapService;
import org.forweb.commandos.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.forweb.commandos.AppInitializer.ROOT;

@RestController
@RequestMapping("/zones")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @Autowired
    private Context context;
    @RequestMapping("/room/{roomId}")
    public List<AbstractZone> getZoneForRoom(@PathVariable("roomId") Integer roomId) {
        Room room = context.getRoom(roomId);
        return room.getMap().getZones();
    }

    @RequestMapping("/list")
    public List<AbstractZone> getZones() {
        List<AbstractZone> out = new ArrayList<>();
        out.add(new Wall(0,0,0,0));
        out.add(new Respawn(0,0, 0));
        out.add(new RespawnBlue(0,0, 0));
        out.add(new RespawnRed(0,0, 0));
        out.add(new FlagRed(0,0, 0));
        out.add(new FlagBlue(0,0, 0));
        out.add(new ShotgunZone(0, 0, 0));
        out.add(new AssaultZone(0, 0, 0));
        out.add(new SniperZone(0, 0, 0));
        out.add(new MinigunZone(0, 0, 0));
        out.add(new FlameZone(0, 0, 0));
        out.add(new RocketZone(0, 0, 0));
        out.add(new MedkitZone(0, 0, 0));
        out.add(new ArmorZone(0, 0, 0));
        out.add(new HelmZone(0, 0, 0));

        List<Tile> tiles = zoneService.getAllTiles();
        out.addAll(tiles.stream()
                .map(v -> new TiledZone(0, 0, null, v))
                .collect(Collectors.toList())
        );
        return out;
    }

    @RequestMapping(value = "/create-zone", method = RequestMethod.POST)
    public boolean createCustomZone(
            @RequestParam("title") String title,
            @RequestParam(value = "width") Integer width,
            @RequestParam(value = "height") Integer height,
            @RequestParam(value = "is_tileset", required = false) Boolean isTileSet,
            @RequestParam("fileupload") MultipartFile file
    ){
        if (!file.isEmpty()) {
            return zoneService.createCustomTile(title, width, height, isTileSet, file);
        } else {
            return false;
        }
    }
}
