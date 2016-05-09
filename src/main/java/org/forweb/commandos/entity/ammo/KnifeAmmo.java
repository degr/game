package org.forweb.commandos.entity.ammo;

public class KnifeAmmo extends Projectile {

    public KnifeAmmo(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(150L);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "blade";
    }

    @Override
    public int getDamage() {
        return 35;
    }
}
