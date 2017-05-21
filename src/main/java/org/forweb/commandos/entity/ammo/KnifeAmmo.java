package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;

public class KnifeAmmo extends Projectile {


    public KnifeAmmo(Person person, double angle) {
        super(person, angle);
        this.setRadius(PersonWebSocketEndpoint.PERSON_RADIUS + 15);
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
        return 45;
    }

}
