package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Minigun;


public class MinigunZone extends WeaponZone {
    public static final String TITLE = "minigun";
    public MinigunZone(int topX, int topY, Integer id, float angle) {
        super(topX, topY, TITLE, id, angle );
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new Minigun();
    }
}
