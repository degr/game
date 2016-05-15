package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Bullet;

public class AssaultRifle extends AbstractWeapon<Bullet> {
    public AssaultRifle() {
        this.setRadius(350);
        this.setShotTimeout(100);
        this.setReloadTimeout(3000);

        this.setMaxClip(120);
        this.setClipSize(30);
        this.setCurrentClip(30);
        this.setTotalClip(30);

        setSpread(7);
    }

    @Override
    public String getName() {
        return "assault";
    }
}
