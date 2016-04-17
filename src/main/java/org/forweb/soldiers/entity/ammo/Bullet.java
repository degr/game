package org.forweb.soldiers.entity.ammo;

public class Bullet extends Projectile{
    public Bullet(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(150L);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public int getDamage() {
        return 20;
    }
}
