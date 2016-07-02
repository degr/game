package org.forweb.commandos.entity.vote;

import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.Vote;
import org.forweb.commandos.service.RoomService;

public class ChangeMapVote extends Vote {
    private GameMap map;
    public ChangeMapVote(GameMap map) {
        this.map = map;
    }

    @Override
    public String getVoteMessage() {
        return "0:Enter 'cmd yes' or 'cmd no' to change map to " + map.getName();
    }

    @Override
    public void process(Room room) {
        RoomService.setMapToRoom(room, map);
        room.setDumpMap(true);
    }
}
