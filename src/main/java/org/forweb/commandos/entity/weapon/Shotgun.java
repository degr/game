package org.forweb.commandos.entity.weapon;


import org.forweb.commandos.entity.ammo.Shot;

public class Shotgun extends AbstractWeapon<Shot> {
    public Shotgun() {
        this.setRadius(200);
        this.setShotTimeout(500);
        this.setReloadTimeout(5000);
        setSpread(15);
        this.setBulletsPerShot(10);


        this.setMaxClip(28);
        this.setClipSize(7);
        this.setCurrentClip(7);
        this.setTotalClip(7);
    }

    @Override
    public String getName() {
        return "shotgun";
    }
}
