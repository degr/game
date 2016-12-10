package org.forweb.commandos.game;


import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.walls.Wall;
import org.forweb.commandos.entity.zone.items.SniperZone;
import org.springframework.stereotype.Component;

import javax.websocket.Session;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class Context {

    private LinkedHashMap<Integer, Room> rooms;



    public Room getRoom(int key) {
        return rooms.get(key);
    }
    public LinkedHashMap<Integer, Room> getRooms() {
        return rooms;
    }
    private Context() {
        rooms = new LinkedHashMap<>();
    }




    public Integer addRoom(Room room) {
        Integer candidate = 0;
        for(int i = 0; i < getRooms().size(); i++) {
            if(getRooms().containsKey(candidate)) {
                candidate++;
            } else {
                break;
            }
        }
        getRooms().put(candidate, room);
        return candidate;
    }
}
