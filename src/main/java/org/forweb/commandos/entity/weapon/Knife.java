package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.KnifeAmmo;

public class Knife extends AbstractWeapon<KnifeAmmo>{
    
    public Knife(){
        this.setRadius(10);
        this.setReloadTimeout(0);
        this.setShotTimeout(200);
        setSpread(1);

        this.setMaxClip(1);
        this.setClipSize(1);
        this.setCurrentClip(1);
        this.setTotalClip(1);
    }

    @Override
    public String getName() {
        return "knife";
    }
}
