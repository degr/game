package org.forweb.commandos.entity;

import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.zone.AbstractZone;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.concurrent.ConcurrentHashMap;

public class Room {

    private Integer id;

    public Room(){}

    private String name;
    private String description;
    private ConcurrentHashMap<Integer, Person> persons;
    private ConcurrentHashMap<Integer, Projectile[]> projectiles;
    private int totalPlayers;

    private GameMap map;
    private long endTime;

    private boolean showStats;
    private List<String> messages = new ArrayList<>();
    public ConcurrentHashMap<Integer, Person> getPersons() {
        return persons;
    }

    private Timer gameTimer = null;
    public void setGameTimer(Timer timer) {
        this.gameTimer = timer;
    }

    public Timer getGameTimer() {
        return gameTimer;
    }

    public void setPersons(ConcurrentHashMap<Integer, Person> persons) {
        this.persons = persons;
    }

    public ConcurrentHashMap<Integer, Projectile[]> getProjectiles() {
        return projectiles;
    }

    public void setProjectiles(ConcurrentHashMap<Integer, Projectile[]> projectiles) {
        this.projectiles = projectiles;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getTotalPlayers() {
        return totalPlayers;
    }

    public void setTotalPlayers(int totalPlayers) {
        this.totalPlayers = totalPlayers;
    }

    public void setMap(GameMap map) {
        this.map = map;
    }

    public GameMap getMap() {
        return map;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setShowStats(boolean showStats) {
        this.showStats = showStats;
    }

    public boolean isShowStats() {
        return showStats;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void addMessage(String message) {
        messages.add(message);
    }

    public List<String> getMessages() {
        return messages;
    }
    public void setMessages(ArrayList<String> messages) {
        this.messages = messages;
    }
}
