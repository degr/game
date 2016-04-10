package websocket.entity;

import websocket.entity.ammo.Projectile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
    
    private Integer height;
    private Integer width;
    private ConcurrentHashMap<Integer, Person> persons;
    private ConcurrentHashMap<Integer, Projectile> projectiles;

    public ConcurrentHashMap<Integer, Person> getPersons() {
        return persons;
    }

    public void setPersons(ConcurrentHashMap<Integer, Person> persons) {
        this.persons = persons;
    }
            
    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }
    
    public ConcurrentHashMap<Integer, Projectile> getProjectiles() {
        return projectiles;
    }

    public void setProjectiles(ConcurrentHashMap<Integer, Projectile> projectiles) {
        this.projectiles = projectiles;
    }
}
