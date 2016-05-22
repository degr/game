package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.ammo.KnifeAmmo;

public class Knife extends AbstractWeapon<KnifeAmmo>{

    private boolean isInstantiated = false;

    public Knife(){
        this.setReloadTimeout(0);
        this.setShotTimeout(200);
        setSpread(1);

        this.setMaxClip(1);
        this.setClipSize(1);
        this.setCurrentClip(1);
        this.setTotalClip(1);
        isInstantiated = true;
    }

    @Override
    public String getName() {
        return "knife";
    }

    @Override
    public void setCurrentClip(int currentClip) {
        if(!isInstantiated) {
            super.setCurrentClip(currentClip);
        }
    }
    @Override
    public void setTotalClip(int currentClip) {
        if(!isInstantiated) {
            super.setTotalClip(currentClip);
        }
    }
}
