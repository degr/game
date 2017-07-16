package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.geometry.services.CircleService;
import org.forweb.geometry.services.LineService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Line;
import org.forweb.geometry.shapes.Point;
import org.forweb.geometry.shapes.Rectangle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LocationService {

    @Autowired
    private ItemService itemService;

    private static final Random random = new Random();

    static Respawn getRespawn(Room room, Person person, List<Integer> respawnIds) {
        List<Respawn> list = new ArrayList<>();
        room.getMap().getZones().stream()
                .filter(zone -> zone instanceof Respawn)
                .forEach(zone -> {
                        Respawn candidate = (Respawn) zone;
                        if (!room.isEverybodyReady() || candidate.getTeam() == person.getTeam() || candidate.getTeam() == 0) {
                            list.add(candidate);
                        }
                });
        if(list.size() == 1) {
            return list.get(0);
        } else {
            if(respawnIds == null) {
                Respawn lastSpawn = null;
                while (list.size() > 0) {
                    int index = random.nextInt(list.size());
                    Respawn out = list.get(index);
                    if (!out.getId().equals(person.getLastRespawnId())) {
                        return out;
                    } else {
                        lastSpawn = list.remove(index);
                    }
                }
                if(lastSpawn != null) {
                    list.add(lastSpawn);
                }
            } else {
                respawn: for(Respawn respawn : list) {
                    for(Integer id : respawnIds ) {
                        if(respawn.getId().equals(id)) {
                            continue respawn;
                        }
                    }
                    respawnIds.add(respawn.getId());
                    return respawn;
                }
            }
        }
        int index = random.nextInt(list.size());
        return list.get(index);
    }

    public void resetLocationsOnRoomReady(Room room) {
        List<AbstractZone> zones = room.getMap().getZones();
        for(int i = zones.size() - 1; i >= 0; i--){
            AbstractZone zone = zones.get(i);
            if(zone instanceof Interactive) {
                Interactive interactive = (Interactive)zone;
                if(interactive.isTemporary()) {
                    zones.remove(i);
                } else {
                    interactive.reset();
                }
            }
        }
    }
}
