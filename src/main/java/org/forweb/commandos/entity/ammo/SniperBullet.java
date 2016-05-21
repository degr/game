package org.forweb.commandos.entity.ammo;

public class SniperBullet extends Projectile {
    public SniperBullet(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
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
