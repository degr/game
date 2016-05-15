package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.SniperBullet;

public class SniperRifle extends AbstractWeapon<SniperBullet> {
    public SniperRifle(){
        this.setReloadTimeout(3000);
        this.setShotTimeout(1500);
        this.setRadius(500);
        this.setSpread(3);

        this.setMaxClip(20);
        this.setClipSize(5);
        this.setCurrentClip(5);
        this.setTotalClip(5);
    }

    @Override
    public String getName() {
        return "sniper";
    }
}
