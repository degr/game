package org.forweb.commandos.entity.zone.items;


import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;

public class ArmorZone extends AbstractItem {

    public static final String TITLE = "armor";

    public ArmorZone(int topX, int topY, Integer id, float angle) {
        super(topX, topY, TITLE, id, angle);
    }


    public static boolean onEnter(Person person, int armor) {
        int armor1 = person.getArmor();
        if (armor1 < 150) {
            armor1 += armor;
            if (armor1 > 150) {
                armor1 = 150;
            }
            person.setArmor(armor1);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void onEnter(Person person, Room room) {
        if(ArmorZone.onEnter(person, 100)) {
            this.setAvailable(false);
            this.shouldUpdate = true;
            super.setTimeout(System.currentTimeMillis() + getTime());
        }
    }

    @Override
    public boolean isTemporary() {
        return false;
    }
}
