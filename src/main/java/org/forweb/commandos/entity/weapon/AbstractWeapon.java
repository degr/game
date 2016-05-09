package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Projectile;

public abstract class AbstractWeapon<T extends Projectile> {
    private int shotTimeout;
    private int reloadTimeout;
    private double radius;

    private int maxClip;
    private int currentClip = 0;

    private int totalClip = 0;
    private int spread;
    private int bulletsPerShot = 1;


    public abstract String getName();

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


    public int getTotalClip() {
        return totalClip;
    }

    public void setTotalClip(int totalClip) {
        this.totalClip = totalClip;
    }


    public void setBulletsPerShot(int bulletsPerShot) {
        this.bulletsPerShot = bulletsPerShot;
    }

    public int getBulletsPerShot() {
        return bulletsPerShot;
    }
}
