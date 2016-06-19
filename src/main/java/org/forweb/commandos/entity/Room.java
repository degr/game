package org.forweb.commandos.entity;

import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.interactive.FlagBlue;
import org.forweb.commandos.entity.zone.interactive.FlagRed;

import javax.websocket.Session;
import java.beans.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class Room {

    private Integer id;

    private final AtomicInteger personIds = new AtomicInteger(0);
    private final AtomicInteger projectilesIds = new AtomicInteger(0);

    private String name;
    private String description;
    private ConcurrentHashMap<Integer, Person> persons;
    private ConcurrentHashMap<Integer, Projectile> projectiles;
    private int totalPlayers;
    private int tempWeaponId = 0;
    private GameMap map;
    private long endTime;

    private boolean showStats;
    private Timer gameTimer = null;
    private Integer team2Score = 0;
    private Integer team1Score = 0;
    private boolean coOp;
    private boolean everybodyReady;


    private ConcurrentHashMap<Integer, Session> sessionStorage = new ConcurrentHashMap<>();

    public ConcurrentHashMap<Integer, Session> getSessionStorage() {
        return sessionStorage;
    }

    public Session getSession(int id) {
        return sessionStorage.get(id);
    }

    public Integer getTeam1Score() {
        return team1Score;
    }

    public void setTeam1Score(Integer team1Score) {
        this.team1Score = team1Score;
    }

    public Integer getTeam2Score() {
        return team2Score;
    }

    public void setTeam2Score(Integer team2Score) {
        this.team2Score = team2Score;
    }


    private List<String> messages = new ArrayList<>();

    public ConcurrentHashMap<Integer, Person> getPersons() {
        return persons;
    }

    public void setGameTimer(Timer timer) {
        this.gameTimer = timer;
    }

    public Timer getGameTimer() {
        return gameTimer;
    }

    public void setPersons(ConcurrentHashMap<Integer, Person> persons) {
        this.persons = persons;
    }

    public ConcurrentHashMap<Integer, Projectile> getProjectiles() {
        return projectiles;
    }

    public void setProjectiles(ConcurrentHashMap<Integer, Projectile> projectiles) {
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

    public AtomicInteger getPersonIds() {
        return personIds;
    }

    public AtomicInteger getProjectilesIds() {
        return projectilesIds;
    }

    public void setCoOp(boolean coOp) {
        this.coOp = coOp;
    }

    public boolean isCoOp() {
        return coOp;
    }

    public boolean isEverybodyReady() {
        return everybodyReady;
    }

    public void setEverybodyReady(boolean everybodyReady) {
        this.everybodyReady = everybodyReady;
    }

    public void updateFlag(int team) {
        for(AbstractZone zone : getMap().getZones()) {
            if(team == 1) {
                if (zone instanceof FlagBlue) {
                    ((FlagBlue) zone).reset();
                }
            } else {
                if (zone instanceof FlagRed) {
                    ((FlagRed) zone).reset();
                }
            }
        }
    }

    public Map.GameType getGameType() {
        if(getMap().getGameType() == null) {
            return Map.GameType.dm;
        } else {
            return Map.GameType.valueOf(getMap().getGameType());
        }
    }

    public int getNewWeaponId() {
        if(tempWeaponId == 0) {
            for (AbstractZone zone : getMap().getZones()) {
                if(zone.getId() != null && zone.getId() > tempWeaponId) {
                    tempWeaponId = zone.getId();
                }
            }
        }
        tempWeaponId++;
        return tempWeaponId;
    }
}
