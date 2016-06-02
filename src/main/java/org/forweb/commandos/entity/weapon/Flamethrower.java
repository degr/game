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
    public String getName() {
        return "flamethrower";
    }

    @Override
    public Projectile getProjectile(Person person, float changedAngle) {
        return new Flame((int)person.getX(),(int) person.getY(), changedAngle, person.getId());
    }
}
