package org.forweb.soldiers.entity.weapon;

import org.forweb.soldiers.entity.ammo.KnifeAmmo;

public class Knife extends AbstractWeapon<KnifeAmmo>{
    
    public Knife(){
        this.setRadius(10);
        this.setMaxClip(1);
        this.setReloadTimeout(0);
        this.setShotTimeout(200);
        this.setCurrentClip(1);
        setSpread(1);
    }

    @Override
    public String getName() {
        return "knife";
    }
}
