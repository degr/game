package org.forweb.commandos.service;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.weapon.*;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.springframework.stereotype.Service;

@Service
public class ItemService {

    public void onGetItem(AbstractItem item, Person player) {
        if(!item.isAvailable()) {
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
            case "flame":
                handleWeaponPick(player, new Flamethrower());
                break;
                //items
            case "medkit":
                int life = player.getLife();
                if(life < 100) {
                    life += 25;
                    if(life > 100) {
                        life = 100;
                    }
                }
                player.setLife(life);
                break;
            case "armor":
                int armor = player.getArmor();
                if(armor < 100) {
                    armor += 100;
                    if(armor > 100) {
                        armor = 100;
                    }
                }
                player.setArmor(armor);
                break;
            case "helm":
                int armor1 = player.getArmor();
                if(armor1 < 150) {
                    armor1 += 50;
                    if(armor1 > 150) {
                        armor1 = 150;
                    }
                }
                player.setArmor(armor1);
                break;
            default:
                throw new RuntimeException("Unknonwn weapon name - " + item.getType());
        }
    }

    private void handleWeaponPick(Person player, AbstractWeapon weapon) {
        for(AbstractWeapon personHaving : player.getWeaponList()) {
            if(personHaving.getClass().equals(weapon.getClass())) {
                //personHaving.
            }
        }

    }
}
