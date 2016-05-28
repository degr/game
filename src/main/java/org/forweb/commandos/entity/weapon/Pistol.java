package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Bullet;

public class Pistol extends AbstractWeapon<Bullet> {
    public Pistol() {
        this.setShotTimeout(1000);
        this.setReloadTimeout(2000);
        this.setSpread(5);

        this.setMaxClip(40);
        this.setClipSize(9);
        this.setCurrentClip(9);
        this.setTotalClip(18);
    }

    @Override
    public String getName() {
        return "pistol";
    }
}
