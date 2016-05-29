package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.geometry.services.CircleService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Point;
import org.forweb.geometry.shapes.Bounds;
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

    public Point getRespawnCenter(Room room){
        List<Respawn> list = new ArrayList<>();
        for(AbstractZone zone : room.getMap().getZones()) {
            if(zone instanceof Respawn) {
                list.add((Respawn) zone);
            }
        }
        Respawn out = list.get(random.nextInt(list.size()));
        return new Point(
                out.getX() + PersonWebSocketEndpoint.PERSON_RADIUS,
                out.getY() + PersonWebSocketEndpoint.PERSON_RADIUS
        );
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
        if(player.getX() >= room.getMap().getX() - PersonWebSocketEndpoint.PERSON_RADIUS) {
            return null;
        } else {
            return calculateCollistions(player, room, distance, 0);
        }
    }
    public Point[] canGoWest(Person player, Room room, double distance) {
        if(player.getX() <= PersonWebSocketEndpoint.PERSON_RADIUS) {
            return null;
        } else {
            return calculateCollistions(player, room, -1 * distance, 0);
        }
    }

    public Point[] canGoNorth(Person player, Room room, double distance) {
        if(player.getY() <= PersonWebSocketEndpoint.PERSON_RADIUS) {
            return null;
        } else {
            return calculateCollistions(player, room, 0, -1 * distance);
        }
    }

    public Point[] canGoSouth(Person player, Room room, double distance) {
        if(player.getY() + PersonWebSocketEndpoint.PERSON_RADIUS >= room.getMap().getY()) {
            return null;
        } else {
            return calculateCollistions(player, room, 0, distance);
        }
    }

    private Point[] calculateCollistions(Person player, Room room, double xShift, double yShift){
        Circle playerCircle = new Circle(
                player.getX() + xShift,
                player.getY() + yShift,
                PersonWebSocketEndpoint.PERSON_RADIUS
        );
        for(AbstractZone zone : room.getMap().getZones()) {
            Point[] point = CircleService.circleBoundsIntersection(playerCircle, GeometryService.getRectangle(zone));
            if (point.length > 0) {
                if(zone.isPassable()) {
                    if(zone instanceof AbstractItem) {
                        itemService.onGetItem((AbstractItem)zone, player);
                    }
                    return PointService.EMPTY;
                } else {
                    return point;
                }
            }
        }
        /*for(Person person : room.getPersons().values()) {
            if(person == player) {
                continue;
            }
            Circle circle = new Circle(
                    person.getX(),
                    person.getY(),
                    PersonWebSocketEndpoint.PERSON_RADIUS
            );
            Point[] p = CircleService.circleCircleIntersection(circle, playerCircle);
            if(p == null || p.length > 0) {
                return false;
            }
        }*/
        return PointService.EMPTY;
    }
}
