package org.forweb.commandos.service;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.weapon.*;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.springframework.stereotype.Service;

@Service
class ItemService {

    void onGetItem(AbstractItem item, Person player) {
        if (!item.isAvailable()) {
            return;
        }
        switch (item.getType()) {
            //weapons
            case "assault":
                handleWeaponPick(player, new AssaultRifle());
                break;
            case "sniper":
                handleWeaponPick(player, new SniperRifle());
                break;
            case "minigun":
                handleWeaponPick(player, new Minigun());
                break;
            case "rocket":
                handleWeaponPick(player, new RocketLauncher());
                break;
            case "flamethrower":
                handleWeaponPick(player, new Flamethrower());
                break;
            case "shotgun":
                handleWeaponPick(player, new Shotgun());
                break;
            //items
            case "medkit":
                int life = player.getLife();
                if (life < 100) {
                    life += 25;
                    if (life > 100) {
                        life = 100;
                    }
                } else {
                    return;
                }
                player.setLife(life);
                break;
            case "armor":
                onArmor(100, player);
                break;
            case "helm":
                onArmor(50, player);
                break;
            default:
                throw new RuntimeException("Unknonwn weapon name - " + item.getType());
        }
        item.setAvailable(false);
        item.setTimeout(System.currentTimeMillis() + item.getTime());
    }

    private void onArmor(int armor, Person person) {
        int armor1 = person.getArmor();
        if (armor1 < 150) {
            armor1 += armor;
            if (armor1 > 150) {
                armor1 = 150;
            }
            person.setArmor(armor1);
        }
    }

    private void handleWeaponPick(Person player, AbstractWeapon weapon) {
        for (AbstractWeapon personHaving : player.getWeaponList()) {
            if (personHaving.getClass().equals(weapon.getClass())) {
                personHaving.setTotalClip(personHaving.getTotalClip() + weapon.getTotalClip());
                personHaving.setCurrentClip(personHaving.getClipSize());
                if (player.isReload() && personHaving == player.getWeapon()) {
                    player.setReload(false);
                    player.setReloadCooldown(0);
                }
                if (personHaving.getTotalClip() > personHaving.getMaxClip()) {
                    personHaving.setTotalClip(weapon.getMaxClip());
                }
                return;
            }
        }
        player.getWeaponList().add(weapon);
    }
}
