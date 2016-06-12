package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.SniperRifle;

public class SniperZone extends WeaponZone{
    public static final String TITLE = "sniper";

    public SniperZone(int topX, int topY, Integer id) {
        super(topX, topY, TITLE, id);
    }

    @Override
    public AbstractWeapon generateWeapon() {
        return new SniperRifle();
    }
}
