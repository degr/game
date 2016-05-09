package org.forweb.commandos.controller;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/zones")
public class ZoneController {


    @RequestMapping("/room/{roomId}")
    public List<AbstractZone> getZoneForRoom(@PathVariable("roomId") Integer roomId) {
        List<AbstractZone> out = new ArrayList<>();

        return out;
    }

    @RequestMapping("/list")
    public List<AbstractZone> getZones() {
        List<AbstractZone> out = new ArrayList<>();
        out.add(new Wall(0,0,0,0));
        out.add(new Respawn(0,0));
        out.add(new ShotgunZone(0, 0));
        out.add(new AssaultZone(0, 0));
        out.add(new SniperZone(0, 0));
        out.add(new MinigunZone(0, 0));
        out.add(new FlameZone(0, 0));
        out.add(new RocketZone(0, 0));
        out.add(new MedkitZone(0, 0));
        out.add(new ArmorZone(0, 0));
        out.add(new HelmZone(0, 0));
        return out;
    }
}
