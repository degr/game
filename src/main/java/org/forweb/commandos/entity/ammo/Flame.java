package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

import java.util.Random;

public class Flame extends Projectile {

    private boolean isStoped;

    private static final Random r = new Random();

    public Flame(Person person, double angle) {
        super(person, angle);
        int speed = r.nextInt(3);
        if(speed == 0) {
            this.setLifeTime((long)new Random().nextInt(500) + 250L );
        } else if (speed == 1) {
            this.setLifeTime((long)new Random().nextInt(1000) + 1000L );
        } else {
            this.setLifeTime((long)new Random().nextInt(3000) + 2000L );
        }

        this.setRadius(250);
        setStoped(false);
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
        return 20;
    }

    public boolean isStoped() {
        return isStoped;
    }

    public void setStoped(boolean stoped) {
        isStoped = stoped;
    }
}
