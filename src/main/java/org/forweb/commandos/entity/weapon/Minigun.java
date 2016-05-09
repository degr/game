package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Bullet;

public class Minigun extends AbstractWeapon<Bullet> {
    public Minigun(){
        this.setMaxClip(120);
        this.setRadius(350);
        this.setShotTimeout(100);
        this.setReloadTimeout(3000);
        this.setSpread(9);
    }

    @Override
    public String getName() {
        return "minigun";
    }
}
