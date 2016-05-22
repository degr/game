package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

public abstract class LinkedAmmo extends Projectile{
    private int personId;

    public LinkedAmmo(int xStart, int yStart, float angle, int personId) {
        super(xStart, yStart, angle);
        this.setPersonId(personId);
    }
    public int getPersonId() {
        return personId;
    }

    public void setPersonId(int personId) {
        this.personId = personId;
    }

}
