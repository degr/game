package org.forweb.soldiers.service;

import org.forweb.soldiers.controller.PersonWebSocketEndpoint;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.entity.zone.AbstractZone;
import org.forweb.soldiers.entity.zone.Respawn;
import org.forweb.soldiers.utils.Point;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class LocationService {

    private static final Random random = new Random();

    public Point getRespawnCenter(Room room){
        List<Respawn> list = new ArrayList<>();
        for(AbstractZone zone : room.getZones()) {
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
        return player.getX() < room.getWidth() - PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, 1, 0);

    }
    public boolean canGoWest(Person player, Room room) {
        return player.getX() > PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, -1, 0);
    }

    public boolean canGoNorth(Person player, Room room) {
        return player.getY() > PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, 0, -1);
    }

    public boolean canGoSouth(Person player, Room room) {
        return player.getY() < room.getHeight() - PersonWebSocketEndpoint.PERSON_RADIUS && calculateCollistions(player, room, 0, 1);
    }

    private boolean calculateCollistions(Person player, Room room, int xShift, int yShift){
        Rectangle playerBounds = new Rectangle(
                player.getX() - PersonWebSocketEndpoint.PERSON_RADIUS + xShift,
                player.getY() - PersonWebSocketEndpoint.PERSON_RADIUS + yShift,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2
        );
        for(AbstractZone zone : room.getZones()) {
            if(zone.isPassable()) {
                continue;
            }
            if(hasCollisions(playerBounds, GeometryService.getRectangle(zone))) {
                return false;
            }
        }
        for(Person person : room.getPersons().values()) {
            if(person == player) {
                continue;
            }
            Rectangle personBounds = new Rectangle(
                    person.getX() - PersonWebSocketEndpoint.PERSON_RADIUS,
                    person.getY() - PersonWebSocketEndpoint.PERSON_RADIUS,
                    PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                    PersonWebSocketEndpoint.PERSON_RADIUS * 2
            );
            if(hasCollisions(playerBounds, personBounds)) {
                return false;
            }
        }
        return true;
    }

    private boolean hasCollisions(Rectangle personNewBounds, Rectangle zoneObject){
        boolean xCol = false;
        boolean yCol = false;
        if ((personNewBounds.x + personNewBounds.width >= zoneObject.x) && (personNewBounds.x <= zoneObject.x + zoneObject.width)) xCol = true;
        if ((personNewBounds.y + personNewBounds.height >= zoneObject.y) && (personNewBounds.y <= zoneObject.y + zoneObject.height)) yCol = true;

        return xCol & yCol;
    }
}
