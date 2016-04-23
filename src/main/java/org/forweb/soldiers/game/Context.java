package org.forweb.soldiers.game;


import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.entity.zone.AbstractZone;
import org.forweb.soldiers.entity.zone.Respawn;
import org.forweb.soldiers.entity.zone.Wall;
import org.springframework.stereotype.Component;

import javax.websocket.Session;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class Context {

    private Room room;

    private Timer gameTimer = null;
    public static final long TICK_DELAY = 10;
    private final AtomicInteger personIds = new AtomicInteger(0);
    private final AtomicInteger projectilesIds = new AtomicInteger(0);


    public Room getRoom() {
        return room;
    }
    private ConcurrentHashMap<Integer, Session> sessionStorage = new ConcurrentHashMap<>();
    
    private Context() {
        room = new Room();
        room.setHeight(480);
        room.setWidth(640);
        room.setPersons(new ConcurrentHashMap<>());
        room.setProjectiles(new ConcurrentHashMap<>());
        List<AbstractZone> zones = new ArrayList<>();
        zones.add(new Wall(40, 40, 60, 60));
        zones.add(new Wall(200, 240, 290, 330));
        zones.add(new Wall(100, 100, 150, 180));
        zones.add(new Wall(300, 140, 450, 160));
        zones.add(new Respawn(0, 0));
        zones.add(new Respawn(200, 200));
        room.setZones(zones);
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
