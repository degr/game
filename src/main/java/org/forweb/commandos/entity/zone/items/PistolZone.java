package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Pistol;

public class PistolZone extends WeaponZone{
    public static final String TITLE = "pistol";
    public PistolZone(int topX, int topY, int id) {
        super(topX, topY, TITLE, id);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new Pistol();
    }
}
