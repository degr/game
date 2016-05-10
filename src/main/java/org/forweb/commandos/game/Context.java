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

    private Timer gameTimer = null;
    public static final long TICK_DELAY = 10;
    private final AtomicInteger personIds = new AtomicInteger(0);
    private final AtomicInteger projectilesIds = new AtomicInteger(0);


    public Room getRoom(int key) {
        return rooms.get(key);
    }
    public LinkedHashMap<Integer, Room> getRooms() {
        return rooms;
    }
    private ConcurrentHashMap<Integer, Session> sessionStorage = new ConcurrentHashMap<>();
    
    private Context() {
        rooms = new LinkedHashMap<>();
    }


    public AtomicInteger getPersonIds() {
        return personIds;
    }

    public void setGameTimer(Timer timer) {
        this.gameTimer = timer;
    }

    public Timer getGameTimer() {
        return gameTimer;
    }
    
    public ConcurrentHashMap<Integer, Session> getSessionStorage() {
        return sessionStorage;
    }

    public Session getSession(int id) {
        return sessionStorage.get(id);
    }

    public AtomicInteger getProjectilesIds() {
        return projectilesIds;
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
