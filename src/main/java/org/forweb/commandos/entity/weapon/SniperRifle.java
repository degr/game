package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.SniperBullet;

public class SniperRifle extends AbstractWeapon<SniperBullet> {
    public SniperRifle(){
        this.setMaxClip(5);
        this.setReloadTimeout(3000);
        this.setShotTimeout(1500);
        this.setRadius(500);
        this.setSpread(3);
    }

    @Override
    public String getName() {
        return "sniper";
    }
}
