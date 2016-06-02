package org.forweb.commandos.entity.ammo;

import java.util.List;

public class Shot extends Projectile {
    public Shot(int xStart, int yStart, float angle) {
        super(xStart, yStart, angle);
        this.setLifeTime(150L);
        this.setRadius(300);
    }

    public List<SubShot> getSubShots() {
        return subShots;
    }

    public void setSubShots(List<SubShot> subShots) {
        this.subShots = subShots;
    }

    private List<SubShot> subShots;

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "shot";
    }

    @Override
    public int getDamage() {
        return 15;
    }
}
