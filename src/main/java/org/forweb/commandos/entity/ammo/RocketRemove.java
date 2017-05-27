package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

import java.util.Random;

public class RocketRemove extends Projectile {

    private final Integer rocketId;

    public RocketRemove(Person person, Rocket rocket) {
        super(person, 0L);
        this.setLifeTime(150L);
        this.rocketId = rocket.getId();
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "rr";
    }

    @Override
    public int getDamage() {
        return 0;
    }

    public String doResponse() {
        return getId() + ":" +
                getName()+ ":" + rocketId;
    }
}
