package org.forweb.soldiers.response;

import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.ammo.Projectile;

import java.util.Collection;

public class Update {
    private final String type = "update";


    private Collection<Person> persons;
    private Collection<Projectile> projectiles;
    
    public Update(Collection<Person> persons, Collection<Projectile> projectiles) {
        this.persons = persons;
        this.projectiles = projectiles;
    }


    public String getType() {
        return type;
    }
    public Collection<Projectile> getProjectiles() {
        return projectiles;
    }
    public Collection<Person> getPersons() {
        return persons;
    }
    public void setPersons(Collection<Person> persons) {
        this.persons = persons;
    }

}
