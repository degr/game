package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Bullet;
import org.forweb.commandos.entity.ammo.Projectile;

public class AssaultRifle extends AbstractWeapon<Bullet> {
    public AssaultRifle() {
        this.setShotTimeout(100);
        this.setReloadTimeout(3000);

        this.setMaxClip(120);
        this.setClipSize(30);
        this.setCurrentClip(30);
        this.setTotalClip(30);

        setSpread(7);
    }

    @Override
    public int getCode() {
        return 4;
    }

    @Override
    public Projectile getProjectile(Person person, double changedAngle) {
        return new Bullet(person, changedAngle);
    }
}
