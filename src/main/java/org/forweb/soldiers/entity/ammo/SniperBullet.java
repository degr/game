package org.forweb.soldiers.entity.ammo;

/**
 * Created by Ror on 15.04.2016.
 */
public class SniperBullet extends Projectile {
    public SniperBullet(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(100L);
        setPiercing(true);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public int getDamage() {
        return 80;
    }
}
