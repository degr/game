package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.geometry.services.CircleService;
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

    public boolean canGoEast(Person player, Room room) {
        return player.getX() < room.getMap().getX() - PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, 1, 0);

    }
    public boolean canGoWest(Person player, Room room) {
        return player.getX() > PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, -1, 0);
    }

    public boolean canGoNorth(Person player, Room room) {
        return player.getY() > PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, 0, -1);
    }

    public boolean canGoSouth(Person player, Room room) {
        return player.getY() < room.getMap().getY() - PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, 0, 1);
    }

    private boolean calculateCollistions(Person player, Room room, int xShift, int yShift){
        Circle playerCircle = new Circle(
                player.getX() + xShift,
                player.getY() + yShift,
                PersonWebSocketEndpoint.PERSON_RADIUS
        );
        for(AbstractZone zone : room.getMap().getZones()) {
            if (CircleService.circleBoundsIntersection(playerCircle, GeometryService.getRectangle(zone)).length > 0) {
                if(zone.isPassable()) {
                    if(zone instanceof AbstractItem) {
                        itemService.onGetItem((AbstractItem)zone, player);
                    }
                } else {
                    return false;
                }
            }


        }
        for(Person person : room.getPersons().values()) {
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
        }
        return true;
    }
}
