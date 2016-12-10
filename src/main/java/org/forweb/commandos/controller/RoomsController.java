package org.forweb.commandos.controller;

import org.forweb.commandos.dto.RoomForJoinDto;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.commandos.game.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

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
        int start = (page - 1) * limit;
        int i = 0;
        Collection<Room> rooms = gameContext.getRooms().values().
                stream().
                filter(v -> !v.isShowStats()).
                sorted((v, v1) -> v.getId() - v1.getId()).
                collect(Collectors.toList());

        for (Room room : rooms) {
            if (i >= start && i < page * limit) {
                GameMap map = room.getMap();
                RoomForJoinDto item = new RoomForJoinDto();
                item.setId(room.getId());
                item.setDescription("Room " + room.getName() + "\n Map: " + room.getMap().getName() + "\n Game mode: " + room.getGameType());
                item.setName(room.getName());
                item.setPersonsCount(room.getTotalPlayers());
                item.setTotalSpace(room.getMaxPlayers());
                GameMap mapOut = new GameMap();
                mapOut.setId(map.getId());
                mapOut.setX(map.getX());
                mapOut.setY(map.getY());
                mapOut.setName(map.getName());
                mapOut.setMaxPlayers(map.getMaxPlayers());
                mapOut.setRating(map.getRating());
                mapOut.setGameType(map.getGameType());
                mapOut.setZones(map.getZones() == null ? null : map.getZones().stream().filter(v -> {
                    if(v instanceof Interactive) {
                        return !((Interactive) v).isTemporary();
                    } else {
                        return true;
                    }
                }).collect(Collectors.toList()));

                item.setMap(mapOut);
                out.add(item);
            }
            i++;
        }
        return out;
    }
}
