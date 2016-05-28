package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.Leave;
import org.forweb.commandos.response.Update;
import org.forweb.commandos.response.dto.Stats;
import org.forweb.commandos.service.person.TurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.Collection;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;
import java.util.stream.Collectors;

@Service
public class SpringDelegationService {

    @Autowired
    private Context gameContext;
    @Autowired
    private LocationService locationService;
    @Autowired
    private PersonService personService;
    @Autowired
    private TurnService turnService;
    @Autowired
    private ResponseService responseService;
    @Autowired
    private ProjectileService projectilesService;
    @Autowired
    private MapService mapService;
    @Autowired
    private RoomService roomService;


    public void onJoin(Session session, Integer personId, Integer roomId, String name) {
        Room room = gameContext.getRoom(roomId);
        Person person = new Person(personId);
        if(room.getPersons().size() >= room.getMap().getMaxPlayers()) {
            person.setInPool(true);
        } else {
            person.setInPool(false);
        }
        gameContext.getSessionStorage().put(personId, session);
        person.setName(name);
        person.setHexColor(locationService.getRandomHexColor());
        personService.resetState(person, gameContext.getRoom(roomId));
        room.getPersons().put(person.getId(), person);
    }

    public int addAndIncrementPersonId() {
        return gameContext.getPersonIds().getAndIncrement();
    }

    public void onTextMessage(String message, int roomId, Integer personId) {
        Room room = gameContext.getRoom(roomId);
        Person person = room.getPersons().get(personId);
        if(!person.isInPool()) {
            room.addMessage(personId + ":" + message.substring(message.indexOf(":") + 1));
        }
    }

    public Integer createRoom(Integer mapId, String roomName) {
        Room room = roomService.createRoom(mapId, roomName);
        startTimer(room);
        return room.getId();
    }

    public void onClose(Integer personId, Integer roomId) {
        removePerson(personId, roomId);
        responseService.flushToAll(new Leave(personId), gameContext.getRoom(roomId));
    }

    private void tick(Room room) {

        if (room.getEndTime() - System.currentTimeMillis() < 0) {
            room.setShowStats(true);
        }

        Collection<Person> persons = room.getPersons().values();
        if (room.isShowStats()) {
            if (persons.size() == 0) {
                gameContext.getRooms().remove(room.getId());
                room.getGameTimer().cancel();
            } else {
                responseService.sendStats(
                        persons.stream()
                                .map(v -> {
                                    Stats stats = new Stats();
                                    stats.setFrags(v.getScore());
                                    stats.setPerson(v.getName());
                                    return stats;
                                })
                                .sorted((v1, v2) -> v1.getFrags() - v2.getFrags())
                                .collect(Collectors.toList()),
                        room
                );
            }
        } else {
            personService.handlePersons(persons, room);
            projectilesService.onProjectileLifecycle(room.getProjectiles(), room);
            mapService.onItemsLifecycle(room.getMap().getZones());
            responseService.broadcast(
                    new Update(
                            responseService.mapPersons(room.getPersons()),
                            responseService.mapProjectiles(room.getProjectiles()),
                            responseService.mapItems(room.getMap().getZones()),
                            room.getMessages(),
                            room.getEndTime() - System.currentTimeMillis()
                    ),
                    room
            );
        }
    }

    public void startTimer(Room room) {
        room.setGameTimer(new Timer(PersonWebSocketEndpoint.class.getSimpleName() + " Timer " + new Random().nextDouble()));

        room.getGameTimer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    tick(room);
                } catch (RuntimeException e) {
                    e.printStackTrace();
                    System.out.println("Caught to prevent timer from shutting down" + e.getMessage());
                }
            }
        }, Context.TICK_DELAY, Context.TICK_DELAY);
    }



    private synchronized void removePerson(Integer personId, Integer roomId) {
        Room room = gameContext.getRoom(roomId);
        if(room != null) {
            room.getPersons().remove(personId);
        }
    }

    /*private void stopTimer(Room room) {
        if (room.getGameTimer() != null) {
            room.getGameTimer().cancel();
        }
    }*/

    public void updatePersonViewAngle(Person person, int direction) {
        turnService.updatePersonViewAngle(person, direction);
    }

    public void handleDirection(Person person, String part) {
        personService.handleDirection(person, part);
    }

    public void doShot(Person person, String status, Integer roomId) {
        projectilesService.doShot(person, status, gameContext.getRoom(roomId));
    }

    public void changeWeapon(Person person, Integer weaponCode) {
        projectilesService.changeWeapon(person, weaponCode);
    }
}
