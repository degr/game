package org.forweb.commandos.entity.vote;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.Vote;

public class KickVote extends Vote {
    private Integer personToKick;
    private String message;

    public KickVote(Integer id, String name) {
        personToKick = id;
        message = "0:Enter 'cmd yes' or 'cmd no' to kick " + name;
    }


    @Override
    public boolean isReady(Room room) {
        int size = room.getPersons().size();
        if(size % 2 == 0) {
            return size / 2 < votes.size();
        } else {
            return (size - 1) / 2 < votes.size();
        }
    }

    @Override
    public String getVoteMessage() {
        return message;
    }

    @Override
    public void process(Room room) {
        Person person = room.getPersons().get(personToKick);
        if(person != null) {
            room.getPersons().remove(personToKick);
            room.getMessages().add("0:" + person.getName() + " was kicked");
        } else {
            room.getMessages().add("0:Kick failed, because person already leave the game");
        }
    }
}
