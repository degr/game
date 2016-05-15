package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.entity.ammo.Rocket;

public class RocketLauncher extends AbstractWeapon<Rocket> {
    public RocketLauncher(){
        this.setRadius(400);
        this.setReloadTimeout(2000);
        this.setShotTimeout(2000);
        setSpread(7);

        this.setMaxClip(5);
        this.setClipSize(1);
        this.setCurrentClip(1);
        this.setTotalClip(3);
    }

    @Override
    public String getName() {
        return "rocket";
    }
}
