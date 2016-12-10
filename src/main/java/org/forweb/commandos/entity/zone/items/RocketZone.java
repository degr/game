package org.forweb.commandos.entity.zone.items;


import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.RocketLauncher;

public class RocketZone extends WeaponZone {
    public static final String TITLE = "rocket";
    public RocketZone(int topX, int topY, Integer id, float angle) {
        super(topX, topY, TITLE, id, angle);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new RocketLauncher();
    }
}
