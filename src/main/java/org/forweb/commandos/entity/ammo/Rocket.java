package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

public class Rocket extends Projectile {


    public Rocket(Person person, double angle) {
        super(person, angle);
        this.setRadius(700);
        this.setLifeTime(1400L);
    }

    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public String getName() {
        return "rocket";
    }

    @Override
    public int getDamage() {
        return 70;
    }

    public String doResponse() {
        return getId() + ":" +
                getName() + ":" +
                (int) getxStart() + ":" +
                (int) getyStart()+":::"+(int)getAngle();
    }
}
