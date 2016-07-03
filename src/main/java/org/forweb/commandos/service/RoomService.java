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
        room.getPersonIds().incrementAndGet();/*to make 0 - system*/
        try {
            room.setName(java.net.URLDecoder.decode(roomName, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            room.setName("oh, shit!");
        }
        room.setDescription(room.getName());
        GameMap map = mapService.loadMap(mapId);
        room.setPersons(new ConcurrentHashMap<>(map.getMaxPlayers()));
        setMapToRoom(room, map, true);


        room.setTotalPlayers(0);
        Integer roomId = gameContext.addRoom(room);
        room.setId(roomId);
        return room;
    }

    public static void setMapToRoom(Room room, GameMap map, boolean noResetState) {
        room.setMap(map);
        room.setEverybodyReady(false);
        room.setShowStats(false);
        if(map.getGameType() != null && !"dm".equals(map.getGameType())) {
            room.setCoOp(true);
        }
        room.setProjectiles(new ConcurrentHashMap<>());
        room.setTeam1Score(0);
        room.setTeam2Score(0);
        for(Person person : room.getPersons().values()) {
            person.setScore(0);
            person.setReady(false);
            if(!noResetState) {
                PersonService.resetState(person, room);
            }
        }
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
