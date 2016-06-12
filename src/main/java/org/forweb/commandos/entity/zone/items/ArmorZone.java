package org.forweb.commandos.entity.zone.items;


import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractItem;

public class ArmorZone extends AbstractItem {

    public static final String TITLE = "armor";

    public ArmorZone(int topX, int topY, Integer id) {
        super(topX, topY, TITLE, id);
    }


    public static void onEnter(Person person, int armor) {
        int armor1 = person.getArmor();
        if (armor1 < 150) {
            armor1 += armor;
            if (armor1 > 150) {
                armor1 = 150;
            }
            person.setArmor(armor1);
        }
    }

    @Override
    public void onEnter(Person person, Room room) {
        ArmorZone.onEnter(person, 100);
    }
}
