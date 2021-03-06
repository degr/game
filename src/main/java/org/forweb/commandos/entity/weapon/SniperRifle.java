package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.SniperBullet;

public class SniperRifle extends AbstractWeapon<SniperBullet> {
    public SniperRifle(){
        this.setReloadTimeout(3000);
        this.setShotTimeout(1500);
        this.setSpread(0);

        this.setMaxClip(20);
        this.setClipSize(5);
        this.setCurrentClip(5);
        this.setTotalClip(10);
    }

    @Override
    public int getCode() {
        return 5;
    }

    @Override
    public Projectile getProjectile(Person person, double changedAngle) {
        return new SniperBullet(person, changedAngle);
    }
}
