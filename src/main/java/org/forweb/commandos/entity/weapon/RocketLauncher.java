package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.Rocket;

public class RocketLauncher extends AbstractWeapon<Rocket> {
    public RocketLauncher(){
        this.setReloadTimeout(2000);
        this.setShotTimeout(1000);
        setSpread(7);

        this.setMaxClip(50);
        this.setClipSize(10);
        this.setCurrentClip(10);
        this.setTotalClip(30);
    }

    @Override
    public String getName() {
        return "rocket";
    }

    @Override
    public Projectile getProjectile(Person person, float changedAngle) {
        return new Rocket((int)person.getX(), (int)person.getY(), changedAngle, person.getId());
    }
}
