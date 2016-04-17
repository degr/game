package org.forweb.soldiers.entity.ammo;

import java.util.Date;

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
    public int getDamage() {
        return 35;
    }
}
