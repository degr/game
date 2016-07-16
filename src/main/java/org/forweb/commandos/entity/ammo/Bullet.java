package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

public class Bullet extends Projectile{

    public Bullet(Person person, double angle) {
        super(person, angle);
        this.setLifeTime(150L);
        this.setRadius(450);
    }


    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "bullet";
    }

    @Override
    public int getDamage() {
        return 35;
    }
}
