package org.forweb.commandos.service;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.weapon.*;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.Interactive;
import org.springframework.stereotype.Service;

@Service
class ItemService {

    void onGetItem(Interactive item, Person player) {
        if (item.isAvailable()) {
            item.onEnter(player);
        }
    }
}
