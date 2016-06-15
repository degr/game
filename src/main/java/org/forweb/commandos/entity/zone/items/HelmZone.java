package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;

public class HelmZone extends AbstractItem {
    public static final String TITLE = "helm";
    public HelmZone(int topX, int topY, int id) {
        super(topX, topY, TITLE, id);
    }

    @Override
    public void onEnter(Person person, Room rom) {
        ArmorZone.onEnter(person, 50);
    }

    @Override
    public boolean isTemporary() {
        return false;
    }
}
