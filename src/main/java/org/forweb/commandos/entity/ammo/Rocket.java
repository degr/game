package org.forweb.commandos.entity.ammo;

public class Rocket extends LinkedAmmo {


    public Rocket(int xStart, int yStart, double angle, int personId) {
        super(xStart, yStart, angle, personId);
        this.setLifeTime(1400L);
        this.setRadius(700);
    }

    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public String getName() {
        return "rocket";
    }

    @Override
    public int getDamage() {
        return 70;
    }
}
