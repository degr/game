package org.forweb.commandos.entity.zone;


import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;

public interface Interactive {
    void onEnter(Person person, Room room);
    boolean isAvailable();
    void reset();
    Integer getId();
    boolean isTemporary();
    boolean shouldUpdate();
    void setUpdated();
}
