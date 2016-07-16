package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

public class SniperBullet extends Projectile {
    public SniperBullet(Person person, double angle) {
        super(person, angle);
        this.setLifeTime(100L);
        setPiercing(true);
        this.setRadius(700);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "slug";
    }

    @Override
    public int getDamage() {
        return 80;
    }
}
