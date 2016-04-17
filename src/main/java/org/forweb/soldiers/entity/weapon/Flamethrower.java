package org.forweb.soldiers.entity.weapon;

import org.forweb.soldiers.entity.ammo.Gas;

public class Flamethrower extends AbstractWeapon<Gas> {
    public Flamethrower(){
        this.setShotTimeout(200);
        this.setReloadTimeout(3000);
        this.setMaxClip(30);
        this.setRadius(80);
        setSpread(15);
    }
}
