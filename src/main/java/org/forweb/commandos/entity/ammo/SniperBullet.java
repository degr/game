package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

public class SniperBullet extends Projectile {
    public SniperBullet(Person person, double angle) {
        super(person, angle);
        this.setRadius(750);
        this.setLifeTime(100L);
        setPiercing(true);
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
