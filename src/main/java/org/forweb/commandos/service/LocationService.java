package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.geometry.services.CircleService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class LocationService {

    @Autowired
    private ItemService itemService;

    private static final Random random = new Random();

    Respawn getRespawn(Room room, Person person, List<Integer> respawnIds) {
        List<Respawn> list = new ArrayList<>();
        room.getMap().getZones().stream()
                .filter(zone -> zone instanceof Respawn).forEach(zone -> {
            Respawn candidate = (Respawn) zone;
            if (!room.isEverybodyReady() || candidate.getTeam() == person.getTeam() || candidate.getTeam() == 0) {
                list.add(candidate);
            }
        });
        if (list.size() == 0) {
            throw new RuntimeException("Map was not properly instantiated for this type of game");
        } else if (list.size() == 1) {
            return list.get(0);
        } else {
            if(respawnIds == null) {
                while (true) {
                    int index = random.nextInt(list.size());
                    Respawn out = list.get(index);
                    if (!out.getId().equals(person.getLastRespawnId())) {
                        return out;
                    } else {
                        list.remove(index);
                        if (list.size() == 0) {
                            //it can't happen
                            throw new RuntimeException("lol");
                        }
                    }
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
                return null;
            }
        }
    }

    public Point[] canGoEast(Person player, Room room, double distance) {
        if (player.getX() >= room.getMap().getX() - PersonWebSocketEndpoint.PERSON_RADIUS) {
            return null;
        } else {
            return calculateCollistions(player, room, distance, 0);
        }
    }

    public Point[] canGoWest(Person player, Room room, double distance) {
        if (player.getX() <= PersonWebSocketEndpoint.PERSON_RADIUS) {
            return null;
        } else {
            return calculateCollistions(player, room, -1 * distance, 0);
        }
    }

    public Point[] canGoNorth(Person player, Room room, double distance) {
        if (player.getY() <= PersonWebSocketEndpoint.PERSON_RADIUS) {
            return null;
        } else {
            return calculateCollistions(player, room, 0, -1 * distance);
        }
    }

    public Point[] canGoSouth(Person player, Room room, double distance) {
        if (player.getY() + PersonWebSocketEndpoint.PERSON_RADIUS >= room.getMap().getY()) {
            return null;
        } else {
            return calculateCollistions(player, room, 0, distance);
        }
    }

    private Point[] calculateCollistions(Person player, Room room, double xShift, double yShift) {
        Circle playerCircle = new Circle(
                player.getX() + xShift,
                player.getY() + yShift,
                PersonWebSocketEndpoint.PERSON_RADIUS
        );
        List<Interactive> itemsToPick = null;
        for (AbstractZone zone : room.getMap().getZones()) {
            Point[] point = CircleService.circleBoundsIntersection(playerCircle, GeometryService.getRectangle(zone));
            if (point.length > 0) {
                if (zone.isPassable()) {
                    if (zone instanceof Interactive) {
                        if (itemsToPick == null) {
                            itemsToPick = new ArrayList<>();
                        }
                        itemsToPick.add((Interactive) zone);
                    }
                } else {
                    return point;
                }
            }
        }
        if (itemsToPick != null) {
            for (Interactive item : itemsToPick) {
                itemService.onGetItem(item, player, room);
            }
        }
        return PointService.EMPTY;
    }

    public void resetLocationsOnRoomReady(Room room) {
        for(AbstractZone zone : room.getMap().getZones()) {
            if(zone instanceof Interactive) {
                Interactive interactive = (Interactive)zone;
                interactive.reset();
            }
        }
    }
}
