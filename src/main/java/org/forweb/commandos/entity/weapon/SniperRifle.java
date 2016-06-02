package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.SniperBullet;

public class SniperRifle extends AbstractWeapon<SniperBullet> {
    public SniperRifle(){
        this.setReloadTimeout(3000);
        this.setShotTimeout(1500);
        this.setSpread(3);

        this.setMaxClip(20);
        this.setClipSize(5);
        this.setCurrentClip(5);
        this.setTotalClip(10);
    }

    @Override
    public String getName() {
        return "sniper";
    }

    @Override
    public Projectile getProjectile(Person person, float changedAngle) {
        return new SniperBullet((int)person.getX(), (int)person.getY(), changedAngle);
    }
}
