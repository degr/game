package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.zone.AbstractItem;

public abstract class WeaponZone extends AbstractItem{
    public WeaponZone(int topX, int topY, String itemName, int id) {
        super(topX, topY, itemName, id);
    }

    public abstract AbstractWeapon generateWeapon();


    @Override
    public void onEnter(Person player) {
        AbstractWeapon weapon = generateWeapon();
        setAvailable(false);
        setTimeout(System.currentTimeMillis() + getTime());
        for (AbstractWeapon personHaving : player.getWeaponList()) {
            if (personHaving.getClass().equals(weapon.getClass())) {
                personHaving.setTotalClip(personHaving.getTotalClip() + weapon.getTotalClip());
                personHaving.setCurrentClip(personHaving.getClipSize());
                if (player.isReload() && personHaving == player.getWeapon()) {
                    player.setReload(false);
                    player.setReloadCooldown(0);
                }
                if (personHaving.getTotalClip() > personHaving.getMaxClip()) {
                    personHaving.setTotalClip(personHaving.getMaxClip());
                }
                return;
            }
        }
        player.getWeaponList().add(weapon);
    }
}
