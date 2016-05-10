package org.forweb.commandos.service;

import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.game.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {

    @Autowired
    private MapService mapService;

    @Autowired
    private Context gameContext;

    public Integer createRoom(Integer mapId, String roomName) {
        Room room = new Room();
        try {
            room.setName(java.net.URLDecoder.decode(roomName, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            room.setName("oh, shit!");
        } ;
        room.setDescription(room.getName());
        GameMap map = mapService.loadMap(mapId);
        room.setMap(map);
        room.setPersons(new ConcurrentHashMap<>(map.getMaxPlayers()));
        room.setProjectiles(new ConcurrentHashMap<>());
        room.setTotalPlayers(0);
        return gameContext.addRoom(room);
    }
}
