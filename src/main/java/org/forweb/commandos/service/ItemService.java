package org.forweb.commandos.service;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.commandos.entity.zone.interactive.FlagBlue;
import org.forweb.commandos.entity.zone.interactive.FlagBlueTemp;
import org.forweb.commandos.entity.zone.interactive.FlagRed;
import org.forweb.commandos.entity.zone.interactive.FlagRedTemp;
import org.springframework.stereotype.Service;

@Service
class ItemService {

    void onGetItem(Interactive item, Person player, Room room) {

        if (item.isAvailable()) {
            item.onEnter(player, room);
        } else if (item instanceof FlagBlue) {
            FlagBlue flag = (FlagBlue) item;
            if (player.getSelfFlag() && player.getTeam() == flag.getTeam() && !flag.isAvailable()) {
                flag.onEnter(player, room);
            }
        } else if (item instanceof FlagRed) {
            FlagRed flag = (FlagRed) item;
            if (player.getSelfFlag() && player.getTeam() == flag.getTeam() && !flag.isAvailable()) {
                flag.onEnter(player, room);
            }
        }
    }
}
