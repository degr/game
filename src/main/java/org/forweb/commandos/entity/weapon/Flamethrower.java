package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Flame;

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
}
