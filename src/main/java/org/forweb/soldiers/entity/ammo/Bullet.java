package org.forweb.soldiers.entity.ammo;

public class Bullet extends Projectile{
    public Bullet(int xStart, int yStart, int xEnd, int yEnd) {
        this.setxStart(xStart);
        this.setyStart(yStart);
        this.setxEnd(xEnd);
        this.setyEnd(yEnd);
        this.setLifeTime(250L);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public int getDamage() {
        return 2;
    }
}
