package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;

public class Explosion extends Projectile{
    public Explosion(int xStart, int yStart, Person person) {
        super(person, 0);
        this.setxStart(xStart);
        this.setyStart(yStart);
        this.setxEnd(xStart);
        this.setyEnd(yStart);
        //real radius is 60. Additional person radius is required for damage calculation.
        this.setRadius(60 + PersonWebSocketEndpoint.PERSON_RADIUS);
        setLifeTime(600L);
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "explosion";
    }

    @Override
    public int getDamage() {
        return 40;
    }

    public int getDamageFactor() {
        return 100;
    }
}
