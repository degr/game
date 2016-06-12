package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Shotgun;

public class ShotgunZone extends WeaponZone {
    public static final String TITLE = "shotgun";
    public ShotgunZone(int x, int y, Integer id) {
        super(x, y, TITLE, id);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new Shotgun();
    }
}
