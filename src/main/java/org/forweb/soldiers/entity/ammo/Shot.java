package org.forweb.soldiers.entity.ammo;

public class Shot extends Projectile {
    public Shot(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(150L);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "shot";
    }

    @Override
    public int getDamage() {
        return 10;
    }
}
