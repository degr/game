package org.forweb.commandos.entity.weapon;


import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.Shot;
import org.forweb.commandos.entity.ammo.SubShot;
import org.forweb.commandos.service.ProjectileService;
import org.hibernate.service.internal.ProvidedService;

import java.util.ArrayList;
import java.util.List;

public class Shotgun extends AbstractWeapon<Shot> {
    public Shotgun() {
        this.setShotTimeout(500);
        this.setReloadTimeout(3000);
        setSpread(15);
        this.setBulletsPerShot(10);


        this.setMaxClip(28);
        this.setClipSize(2);
        this.setCurrentClip(2);
        this.setTotalClip(6);
    }

    @Override
    public String getName() {
        return "shotgun";
    }

    @Override
    public Projectile getProjectile(Person person, float angle) {
        int subShotsCount = getBulletsPerShot();
        Shot out = new Shot((int)person.getX(), (int)person.getY(), person.getAngle());
        List<SubShot> list = new ArrayList<>(subShotsCount);
        for(int i = 0; i < subShotsCount; i++) {
            list.add(new SubShot((int)person.getX(), (int)person.getY(), ProjectileService.changeProjectileAngle(person)));
        }
        out.setSubShots(list);
        return out;
    }
}
