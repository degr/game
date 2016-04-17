package org.forweb.soldiers.entity.ammo;

public class Rocket extends Projectile {


    public Rocket(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(1500L);
    }

    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public int getDamage() {
        return 120;
    }
}
