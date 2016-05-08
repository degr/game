package org.forweb.soldiers.game;


import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.entity.zone.AbstractZone;
import org.forweb.soldiers.entity.zone.interactive.Respawn;
import org.forweb.soldiers.entity.zone.walls.Wall;
import org.forweb.soldiers.entity.zone.items.SniperZone;
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
        for(int i = 0; i < 20;i++) {
            Room room = new Room();
            room.setHeight(480);
            room.setWidth(640);
            room.setPersons(new ConcurrentHashMap<>());
            room.setProjectiles(new ConcurrentHashMap<>());
            List<AbstractZone> zones = new ArrayList<>();
            zones.add(new Wall(40, 40, 60, 60));
            zones.add(new Wall(200, 240, 290, 330));
            zones.add(new Wall(100, 100, 150, 180));
            zones.add(new Wall(300, 140, 450, 160));
            zones.add(new Wall(350, 10, 390, 120));
            zones.add(new Wall(150, 370, 250, 415));
            zones.add(new Wall(550, 400, 600, 480));
            zones.add(new Wall(550, 400, 600, 480));
            zones.add(new SniperZone(500, 400));
            zones.add(new Respawn(0, 0));
            zones.add(new Respawn(200, 200));
            room.setZones(zones);
            rooms.put(i, room);
        }
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
}
