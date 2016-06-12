package org.forweb.commandos.service;

import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.game.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {

    private  static final long ROOM_LIFETIME = 10 * 60 * 1000;

    @Autowired
    private MapService mapService;

    @Autowired
    private Context gameContext;

    public Room createRoom(Integer mapId, String roomName) {
        Room room = new Room();
        try {
            room.setName(java.net.URLDecoder.decode(roomName, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            room.setName("oh, shit!");
        }
        room.setDescription(room.getName());
        GameMap map = mapService.loadMap(mapId);
        room.setMap(map);
        if(map.getGameType() != null && !"dm".equals(map.getGameType())) {
            room.setCoOp(true);
        }
        room.setPersons(new ConcurrentHashMap<>(map.getMaxPlayers()));
        room.setProjectiles(new ConcurrentHashMap<>());
        room.setTotalPlayers(0);
        Integer roomId = gameContext.addRoom(room);
        room.setId(roomId);
        return room;
    }

    public void onPersonReady(Room room){
        if(!room.isEverybodyReady()) {
            int personsCount = room.getPersons().size();
            boolean onCountReady = false;
            boolean onTeamsReady = Map.GameType.dm.toString().equals(room.getMap().getGameType());
            int team1 = 0;
            int team2 = 0;
            if(personsCount > 1) {
                int readyPersons = 0;
                for (Person person : room.getPersons().values()) {
                    if (person.isReady()) {
                        readyPersons++;
                    }
                    switch (person.getTeam()) {
                        case 1: team1++; break;
                        case 2: team2++; break;
                    }
                }
                onCountReady = readyPersons * 2 > personsCount;
            }
            if(onCountReady && (onTeamsReady || (team1 > 0 && team2 > 0))) {
                room.setEverybodyReady(true);
                room.setEndTime(System.currentTimeMillis() + ROOM_LIFETIME);
            }
        }
    }
}
