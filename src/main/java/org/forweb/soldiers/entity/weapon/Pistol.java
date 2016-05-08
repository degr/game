package org.forweb.soldiers.entity.weapon;

import org.forweb.soldiers.entity.ammo.Bullet;

public class Pistol extends AbstractWeapon<Bullet> {
    public Pistol() {
        this.setMaxClip(7);
        this.setShotTimeout(1000);
        this.setReloadTimeout(2000);
        this.setRadius(300);
        this.setSpread(5);
    }

    @Override
    public String getName() {
        return "pistol";
    }
}
