package org.forweb.soldiers.entity.weapon;

import org.forweb.soldiers.entity.ammo.Rocket;

public class RocketLauncher extends AbstractWeapon<Rocket> {
    public RocketLauncher(){
        this.setMaxClip(1);
        this.setRadius(300);
        this.setReloadTimeout(2000);
        this.setShotTimeout(2000);
        setSpread(7);
    }

    @Override
    public String getName() {
        return "rocket";
    }
}
