package org.forweb.commandos.entity;

import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.zone.AbstractZone;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class Room {


    private String name;
    private String description;
    private ConcurrentHashMap<Integer, Person> persons;
    private ConcurrentHashMap<Integer, Projectile> projectiles;
    private int totalPlayers;

    private GameMap map;

    public ConcurrentHashMap<Integer, Person> getPersons() {
        return persons;
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
}
