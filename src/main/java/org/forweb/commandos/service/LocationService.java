package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.geometry.services.CircleService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class LocationService {

    @Autowired
    private ItemService itemService;

    private static final Random random = new Random();

    Respawn getRespawn(Room room, Person person) {
        List<Respawn> list = new ArrayList<>();
        for (AbstractZone zone : room.getMap().getZones()) {
            if (zone instanceof Respawn) {
                list.add((Respawn) zone);
            }
        }
        int i = 0;
        while (i < 100) {
            i++;
            Respawn out = list.get(random.nextInt(list.size()));
            if (!out.getId().equals(person.getLastRespawnId())) {
                return out;
            }
        }
        return null;
    }

    public String getRandomHexColor() {
        float hue = random.nextFloat();
        // sat between 0.1 and 0.3
        float saturation = (random.nextInt(2000) + 1000) / 10000f;
        float luminance = 0.9f;
        Color color = Color.getHSBColor(hue, saturation, luminance);
        return '#' + Integer.toHexString(
                (color.getRGB() & 0xffffff) | 0x1000000).substring(1);
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
        List<AbstractItem> itemsToPick = null;
        for (AbstractZone zone : room.getMap().getZones()) {
            Point[] point = CircleService.circleBoundsIntersection(playerCircle, GeometryService.getRectangle(zone));
            if (point.length > 0) {
                if (zone.isPassable()) {
                    if (zone instanceof AbstractItem) {
                        if (itemsToPick == null) {
                            itemsToPick = new ArrayList<>();
                        }
                        itemsToPick.add((AbstractItem) zone);
                    }
                } else {
                    return point;
                }
            }
        }
        if (itemsToPick != null) {
            for (AbstractItem item : itemsToPick) {
                itemService.onGetItem(item, player);
            }
        }
        return PointService.EMPTY;
    }
}
