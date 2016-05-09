package org.forweb.commandos.entity.weapon;


import org.forweb.commandos.entity.ammo.Shot;

public class Shotgun extends AbstractWeapon<Shot> {
    public Shotgun() {
        this.setMaxClip(5);
        this.setRadius(200);
        this.setShotTimeout(500);
        this.setReloadTimeout(5000);
        setSpread(15);
        this.setBulletsPerShot(10);
    }

    @Override
    public String getName() {
        return "shotgun";
    }
}
