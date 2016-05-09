package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Bullet;

public class AssaultRifle extends AbstractWeapon<Bullet> {
    public AssaultRifle() {
        this.setMaxClip(30);
        this.setRadius(350);
        this.setShotTimeout(100);
        this.setReloadTimeout(3000);
        setSpread(7);
    }

    @Override
    public String getName() {
        return "assault";
    }
}
