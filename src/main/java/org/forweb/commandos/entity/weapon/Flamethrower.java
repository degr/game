package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Flame;
import org.forweb.commandos.entity.ammo.Projectile;

public class Flamethrower extends AbstractWeapon<Flame> {
    public Flamethrower(){
        this.setShotTimeout(50);
        this.setReloadTimeout(3000);
        setSpread(15);

        this.setMaxClip(480);
        this.setClipSize(120);
        this.setCurrentClip(120);
        this.setTotalClip(120);
    }

    @Override
    public int getCode() {
        return 6;
    }

    @Override
    public Projectile getProjectile(Person person, double changedAngle) {
        return new Flame(person, changedAngle);
    }
}
