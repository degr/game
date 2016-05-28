package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Bullet;

public class Minigun extends AbstractWeapon<Bullet> {
    public Minigun(){
        this.setShotTimeout(100);
        this.setReloadTimeout(5000);
        this.setSpread(9);

        this.setMaxClip(480);
        this.setClipSize(120);
        this.setCurrentClip(120);
        this.setTotalClip(120);
    }

    @Override
    public String getName() {
        return "minigun";
    }
}
