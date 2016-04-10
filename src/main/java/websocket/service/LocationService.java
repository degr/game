package websocket.service;

import websocket.entity.Room;
import websocket.entity.Location;
import websocket.controller.PersonController;

import java.awt.*;
import java.util.Random;

public class LocationService {

    private static final Random random = new Random();
    
    public Location getRandomLocation(Room room) {
        int x = roundByGridSize(random.nextInt(room.getWidth()), room.getWidth());
        int y = roundByGridSize(random.nextInt(room.getHeight()), room.getHeight());
        return new Location(x, y);
    }


    private int roundByGridSize(int value, int limit) {
        if(value < PersonController.PERSON_RADIUS) {
            return PersonController.PERSON_RADIUS;
        } else if(value + PersonController.PERSON_RADIUS > limit) {
            return limit - PersonController.PERSON_RADIUS;
        } else {
            return  value;
        }
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

    public boolean canGoEast(int x, Integer width) {
        return x < width - PersonController.PERSON_RADIUS;
    }

    public boolean canGoWest(int x) {
        return x > PersonController.PERSON_RADIUS;
    }

    public boolean canGoNorth(int y) {
        return y > PersonController.PERSON_RADIUS;
    }
    
    public boolean canGoSouth(int y, Integer height) {
        return y < height - PersonController.PERSON_RADIUS;
    }
}
