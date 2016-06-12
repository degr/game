package org.forweb.commandos.entity.zone;


import org.forweb.commandos.entity.Person;

public interface Interactive {
    void onEnter(Person person);
    boolean isAvailable();
}
