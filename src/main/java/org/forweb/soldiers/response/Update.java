package org.forweb.soldiers.response;

import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.entity.ammo.Projectile;
import org.forweb.soldiers.entity.zone.AbstractZone;

import java.util.Collection;

public class Update {
    private final String type = "update";

    private Collection<AbstractZone> zones;

    private Collection<Person> persons;
    private Collection<Projectile> projectiles;
    public Update(Room room) {
        this.persons = room.getPersons().values();
        this.projectiles = room.getProjectiles().values();
        this.zones = room.getZones();
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
    public Collection<AbstractZone> getZones() {
        return zones;
    }

}
