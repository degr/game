package org.forweb.commandos.entity.zone.items;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;

public class MedkitZone extends AbstractItem {
    public static final String TITLE = "medkit";

    public MedkitZone(int topX, int topY, Integer id) {
        super(topX, topY, TITLE, id);
    }

    @Override
    public void onEnter(Person person, Room room) {
        int life = person.getLife();
        if (life < 100) {
            life += 25;
            if (life > 100) {
                life = 100;
            }
        } else {
            return;
        }
        person.setLife(life);
        setAvailable(false);
        setTimeout(System.currentTimeMillis() + getTime());
    }

    @Override
    public boolean isTemporary() {
        return false;
    }
}
