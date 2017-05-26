package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.utils.Vector;

import java.util.Random;

public class FlameRemove extends Projectile {

    private static final Random r = new Random();
    private final Integer flameId;

    public FlameRemove(Person person, Flame flame) {
        super(person, 0L);
        this.setLifeTime(150L);
        this.flameId = flame.getId();
    }

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "fr";
    }

    @Override
    public int getDamage() {
        return 0;
    }

    public String doResponse() {
        return getId() + ":" +
                getName()+ ":" + flameId;
    }
}
