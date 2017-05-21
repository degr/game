package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

import java.util.Random;

public class Flame extends Projectile {

    public static final int RADIUS = 250;

    private boolean isStoped;

    private static final Random r = new Random();

    public Flame(Person person, double angle) {
        super(person, angle);
        int speed = r.nextInt(3);
        this.setRadius(RADIUS);
        if(speed == 0) {
            this.setLifeTime((long)new Random().nextInt(500) + 250L );
        } else if (speed == 1) {
            this.setLifeTime((long)new Random().nextInt(1000) + 1000L );
        } else {
            this.setLifeTime((long)new Random().nextInt(3000) + 2000L );
        }

        setStoped(false);
    }



    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public String getName() {
        return "f";
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


    public String doResponse() {
        return getId() + ":" +
                getName() + ":" +
                (int) getxStart() + ":" +
                (int) getyStart();
    }
}
