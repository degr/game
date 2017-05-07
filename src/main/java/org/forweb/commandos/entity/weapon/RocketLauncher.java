package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.Rocket;

public class RocketLauncher extends AbstractWeapon<Rocket> {
    public RocketLauncher(){
        this.setReloadTimeout(2000);
        this.setShotTimeout(1000);
        setSpread(0);

        this.setMaxClip(5);
        this.setClipSize(1);
        this.setCurrentClip(1);
        this.setTotalClip(3);
    }

    @Override
    public int getCode() {
        return 8;
    }

    @Override
    public Projectile getProjectile(Person person, double changedAngle) {
        return new Rocket(person, changedAngle);
    }
}
