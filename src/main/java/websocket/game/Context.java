package websocket.game;


import websocket.entity.Room;

import javax.websocket.Session;
import java.util.Timer;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class Context {
    static Context context = new Context();

    public static Context getInstance() {
        return context;
    }

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
        room = new Room();
        room.setHeight(480);
        room.setWidth(640);
        room.setPersons(new ConcurrentHashMap<>());
        room.setProjectiles(new ConcurrentHashMap<>());
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
