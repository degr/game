package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Minigun;


public class MinigunZone extends WeaponZone {
    public static final String TITLE = "minigun";
    public MinigunZone(int topX, int topY, Integer id) {
        super(topX, topY, TITLE, id );
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new Minigun();
    }
}
