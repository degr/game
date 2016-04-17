package org.forweb.soldiers.entity.weapon;

import org.forweb.soldiers.entity.ammo.Projectile;

public class AbstractWeapon<T extends Projectile> {
    private int shotTimeout;
    private int reloadTimeout;
    private double radius;
    private int maxClip;
    private int currentClip = 0;
    private int spread;


    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    public int getReloadTimeout() {
        return reloadTimeout;
    }

    public void setReloadTimeout(int reloadTimeout) {
        this.reloadTimeout = reloadTimeout;
    }

    public int getShotTimeout() {
        return shotTimeout;
    }

    public void setShotTimeout(int shotTimeout) {
        this.shotTimeout = shotTimeout;
    }

    public int getMaxClip() {
        return maxClip;
    }

    public void setMaxClip(int maxClip) {
        this.maxClip = maxClip;
    }

    public int getCurrentClip() {
        return currentClip;
    }

    public void setCurrentClip(int currentClip) {
        this.currentClip = currentClip;
    }

    public int getSpread() {
        return spread;
    }

    public void setSpread(int spread) {
        this.spread = spread;
    }
}
