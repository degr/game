package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;

public class KnifeAmmo extends Projectile {

    public KnifeAmmo(int xStart, int yStart, double angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(150L);
        this.setRadius(PersonWebSocketEndpoint.PERSON_RADIUS + 15);
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
        return 45;
    }
}
