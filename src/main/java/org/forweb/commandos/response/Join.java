package org.forweb.commandos.response;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;

import java.util.Collection;
import java.util.List;


public class Join { 
    private final String type = "join";
    private Integer id;
    private Collection<Person> persons;
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
    
    public Collection<Person> getPersons() {
        return persons;
    }

    public void setPersons(Collection<Person> persons) {
        this.persons = persons;
    }
}
