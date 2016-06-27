package org.forweb.commandos.entity.ammo;

import java.util.Random;

public class Flame extends LinkedAmmo {

    private boolean isStoped;

    private static final Random r = new Random();

    public Flame(int xStart, int yStart, double angle, int personId) {
        super(xStart, yStart, angle, personId);
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
        return 15;
    }

    public boolean isStoped() {
        return isStoped;
    }

    public void setStoped(boolean stoped) {
        isStoped = stoped;
    }
}
