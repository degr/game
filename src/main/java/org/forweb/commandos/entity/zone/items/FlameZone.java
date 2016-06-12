package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Flamethrower;

public class FlameZone extends WeaponZone {
    public static final String TITLE = "flamethrower";

    public FlameZone(int topX, int topY, Integer id) {
        super(topX, topY, TITLE, id);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new Flamethrower();
    }
}
