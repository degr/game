package org.forweb.commandos.entity.vote;

import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.Vote;
import org.forweb.commandos.service.RoomService;

public class RestartVote extends Vote {
    private final String name;

    public RestartVote(String name) {
        this.name = name;
    }

    @Override
    public String getVoteMessage() {
        return name + " vote restart. Type 'cmd yes' or 'cmd no'";
    }

    @Override
    public void process(Room room) {
        RoomService.setMapToRoom(room, room.getMap(), false);
        room.getMessages().add("0:Room restarted");
    }
}
