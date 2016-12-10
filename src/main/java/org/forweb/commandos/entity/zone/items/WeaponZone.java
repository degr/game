package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.zone.AbstractItem;

public abstract class WeaponZone extends AbstractItem{
    private boolean isTemporary = false;

    public WeaponZone(int topX, int topY, String itemName, int id, float angle) {
        super(topX, topY, itemName, id, angle);
    }

    public abstract AbstractWeapon generateWeapon();


    @Override
    public void onEnter(Person player, Room room) {
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
        this.shouldUpdate = true;
    }

    @Override
    public boolean isTemporary() {
        return isTemporary;
    }

    public void setTemporary(boolean temporary) {
        this.isTemporary = temporary;
    }
}
