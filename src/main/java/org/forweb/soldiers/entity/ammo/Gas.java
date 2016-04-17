package org.forweb.soldiers.entity.ammo;

public class Gas extends Projectile {


    public Gas(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(3000L);
    }

    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public int getDamage() {
        return 10;
    }
}
