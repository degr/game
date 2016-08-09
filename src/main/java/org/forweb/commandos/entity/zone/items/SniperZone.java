package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.SniperRifle;

public class SniperZone extends WeaponZone{
    public static final String TITLE = "sniper";

    public SniperZone(int topX, int topY, Integer id, float angle) {
        super(topX, topY, TITLE, id, angle);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new SniperRifle();
    }
}
