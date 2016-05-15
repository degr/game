package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Flame;

public class Flamethrower extends AbstractWeapon<Flame> {
    public Flamethrower(){
        this.setShotTimeout(200);
        this.setReloadTimeout(3000);
        this.setRadius(80);
        setSpread(15);

        this.setMaxClip(120);
        this.setClipSize(30);
        this.setCurrentClip(30);
        this.setTotalClip(30);
    }

    @Override
    public String getName() {
        return "flamethrower";
    }
}
