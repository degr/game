package org.forweb.soldiers.entity.weapon;

import org.forweb.soldiers.entity.ammo.Bullet;

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
