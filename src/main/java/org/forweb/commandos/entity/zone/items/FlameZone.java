package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Flamethrower;

public class FlameZone extends WeaponZone {
    public static final String TITLE = "flamethrower";

    public FlameZone(int topX, int topY, Integer id, float angle) {
        super(topX, topY, TITLE, id, angle);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new Flamethrower();
    }
}
