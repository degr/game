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

    public Point[] calculateCollistions(Person player, Room room, double xShift, double yShift) {
        Circle playerCircle = new Circle(
                player.getX() + xShift,
                player.getY() + yShift,
                PersonWebSocketEndpoint.PERSON_RADIUS
        );
        List<Interactive> itemsToPick = null;
        Set<AbstractZone> set = new HashSet<>();
        for(List<AbstractZone> zones : room.getClusterZonesFor(player)) {
            for (AbstractZone zone : zones) {
                if(set.contains(zone)) {
                    continue;
                } else {
                    set.add(zone);
                }
                Rectangle rectangle = zone.getRectangle();
                Point[] point = GeometryService.circleIntersectRectangle(playerCircle, rectangle);

                if (point != PointService.EMPTY) {
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
        }
        if (itemsToPick != null) {
            for (Interactive item : itemsToPick) {
                itemService.onGetItem(item, player, room);
                if(item.isTemporary()) {
                    List<AbstractZone> zones = room.getMap().getZones();
                    int length = zones.size();
                    for(int i = length - 1; i >= 0; i--) {
                        if(zones.get(i) == item) {
                            zones.remove(i);
                            break;
                        }
                    }
                }
            }
        }
        return PointService.EMPTY;
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
