package org.forweb.commandos.controller;

import org.forweb.commandos.dto.RoomForJoinDto;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.game.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
public class RoomsController {

    @Autowired
    Context gameContext;

    @RequestMapping("/list/{page}/{limit}")
    public List<RoomForJoinDto> getRoomForJoin(
            @PathVariable("page") Integer page,
            @PathVariable("limit") Integer limit
    ) {
        if (limit > 30) {
            limit = 30;
        } else if (limit < 0) {
            limit = 0;
        }
        List<RoomForJoinDto> out = new ArrayList<>();
        LinkedHashMap<Integer, Room> rooms = gameContext.getRooms();
        int start = (page - 1) * limit;
        int i = 0;
        for (Map.Entry<Integer, Room> entry : rooms.entrySet()) {
            if (i > start && i < page * limit) {
                Room room = entry.getValue();
                RoomForJoinDto item = new RoomForJoinDto();
                item.setId(entry.getKey());
                item.setDescription(room.getDescription());
                item.setName(room.getName());
                item.setPersonsCount(room.getPersons().size());
                item.setTotalSpace(room.getTotalPlayers());
                item.setZones(room.getZones());
                item.setX(room.getWidth());
                item.setY(room.getHeight());
                out.add(item);
            }
            i++;
        }
        return out;
    }
}
