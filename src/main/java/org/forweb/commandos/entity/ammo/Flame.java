package org.forweb.commandos.entity.ammo;

public class Flame extends Projectile {


    public Flame(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(3000L);
    }

    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public String getName() {
        return "flame";
    }

    @Override
    public int getDamage() {
        return 10;
    }
}
