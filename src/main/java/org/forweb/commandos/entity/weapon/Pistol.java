package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Bullet;
import org.forweb.commandos.entity.ammo.Projectile;

public class Pistol extends AbstractWeapon<Bullet> {
    public Pistol() {
        this.setShotTimeout(500);
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

    @Override
    public Projectile getProjectile(Person person, double angle) {
        return new Bullet(person, angle);
    }
}
