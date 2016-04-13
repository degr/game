package org.forweb.soldiers.response;

import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.ammo.Projectile;

import java.util.Collection;
import java.util.List;


public class Join { 
    private final String type = "join";
    private Integer id;
    private Person person;
    private List<Projectile> projectiles;
    
    public List<Projectile> getProjectiles() {
        return projectiles;
    }

    public void setProjectiles(List<Projectile> projectiles) {
        this.projectiles = projectiles;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }
    
    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

}
