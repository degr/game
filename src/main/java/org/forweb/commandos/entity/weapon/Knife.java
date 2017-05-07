package org.forweb.commandos.entity.weapon;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.ammo.KnifeAmmo;
import org.forweb.commandos.entity.ammo.Projectile;

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
    public int getCode() {
        return 1;
    }

    @Override
    public Projectile getProjectile(Person person, double angle) {
        return new KnifeAmmo(person, angle);
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
