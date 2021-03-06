package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.WebSocketResponse;
import org.forweb.commandos.entity.ammo.Projectile;

public abstract class AbstractWeapon<T extends Projectile> implements WebSocketResponse {
    private int shotTimeout;
    private int reloadTimeout;

    /**
     * ammo limit for gun
     */
    private int maxClip;
    /**
     * ammo count for payload
     */
    private int clipSize;
    /**
     * current ammo in gun
     */
    private int currentClip = 0;
    /**
     * total ammo count in player backpack
     */
    private int totalClip = 0;

    private int spread;
    private int bulletsPerShot = 1;
    private boolean dumpRequire;
    public AbstractWeapon() {
        setDumpRequire(true);
    }

    public abstract int getCode();
    public abstract Projectile getProjectile(Person person, double changedAngle);

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

    public float getSpread() {
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


    public int getClipSize() {
        return clipSize;
    }

    public void setClipSize(int clipSize) {
        this.clipSize = clipSize;
    }


    @Override
    public String doResponse() {
        return getCode() + ":" + getTotalClip() + ":" + getCurrentClip();
    }

    public void setDumpRequire(boolean dumpRequire) {
        this.dumpRequire = dumpRequire;
    }

    public boolean isDumpRequire() {
        return dumpRequire;
    }
}
