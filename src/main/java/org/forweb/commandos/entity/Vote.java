package org.forweb.commandos.entity;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;

import java.util.HashMap;
import java.util.Map;

public abstract class Vote {
    private static final int REMINDERS_COUNT_PER_LIFE = 5;
    private static final int ONE_REMINDER = 7 * 1000;
    private static final int MAX_TIME = ONE_REMINDER * REMINDERS_COUNT_PER_LIFE;
    private static final int REMINDER_PERIOD = (int)(ONE_REMINDER / PersonWebSocketEndpoint.TICK_DELAY);

    private int lifetime = 0;
    private int reminder = 0;

    public abstract String getVoteMessage();
    public abstract void process(Room room);
    public boolean isReady(Room room) {
        return room.getPersons().size() / 2 < votes.size();
    }

    protected Map<Integer, Boolean> votes = new HashMap<>();
    public boolean addVote(Integer personId, boolean status) {
        boolean out;
        if(votes.containsKey(personId)) {
            out = status != votes.get(personId);
        } else {
            out = true;
        }
        votes.put(personId, status);
        return out;
    }
    public void removeVote(Integer personId) {
        votes.remove(personId);
    }

    public void onRemind(Room room) {
        if(reminder == 0 || reminder > REMINDER_PERIOD) {
            reminder = 0;
            lifetime++;
            room.getMessages().add(getVoteMessage() + " " +(MAX_TIME - lifetime * ONE_REMINDER) + " seconds remain.");
        }
        reminder++;
    }

    public boolean isOld() {
        return MAX_TIME - (lifetime * ONE_REMINDER + reminder * PersonWebSocketEndpoint.TICK_DELAY) < 0;
    }
}
