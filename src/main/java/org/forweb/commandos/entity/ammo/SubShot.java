package org.forweb.commandos.entity.ammo;

public class SubShot extends Projectile{

    public SubShot(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setRadius(300);
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
        return 15;
    }
}
