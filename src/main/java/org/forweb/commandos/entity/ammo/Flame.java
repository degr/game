package org.forweb.commandos.entity.ammo;

public class Flame extends LinkedAmmo {

    private boolean isStoped;

    public Flame(int xStart, int yStart, float angle, int personId) {
        super(xStart, yStart, angle, personId);
        this.setLifeTime(3000L);
        this.setRadius(120);
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
        return 10;
    }

    public boolean isStoped() {
        return isStoped;
    }

    public void setStoped(boolean stoped) {
        isStoped = stoped;
    }
}
