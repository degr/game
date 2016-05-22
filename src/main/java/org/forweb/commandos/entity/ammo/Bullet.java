package org.forweb.commandos.entity.ammo;

public class Bullet extends Projectile{
    public Bullet(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(150L);
        this.setRadius(450);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "bullet";
    }

    @Override
    public int getDamage() {
        return 35;
    }
}
