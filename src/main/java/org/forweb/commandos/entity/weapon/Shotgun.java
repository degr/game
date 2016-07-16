package org.forweb.commandos.entity.weapon;


import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.Shot;
import org.forweb.commandos.entity.ammo.SubShot;

import java.util.ArrayList;
import java.util.List;

public class Shotgun extends AbstractWeapon<Shot> {
    public Shotgun() {
        this.setShotTimeout(500);
        this.setReloadTimeout(2000);
        setSpread(0);
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
    public Projectile getProjectile(Person person, double angle) {
        int subShotsCount = getBulletsPerShot();
        Shot out = new Shot(person, person.getAngle());
        double spread = 15d;
        double shift = spread / getBulletsPerShot();
        double initialAngle = angle - spread / 2;
        List<SubShot> list = new ArrayList<>(subShotsCount);
        for(int i = 0; i < subShotsCount; i++) {
            list.add(new SubShot(person, initialAngle));
            initialAngle += shift;
        }
        out.setSubShots(list);
        return out;
    }
}
