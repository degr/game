package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

public class SubShot extends Projectile{

    public SubShot(Person person, double angle) {
        super(person, angle);
        this.setRadius(300);
        this.setLifeTime(150L);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "shot";
    }

    @Override
    public int getDamage() {
        return 15;
    }
}
