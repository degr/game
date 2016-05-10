package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.Leave;
import org.forweb.commandos.response.Update;
import org.forweb.commandos.service.person.TurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.Collection;
import java.util.Timer;
import java.util.TimerTask;

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


    public void onJoin(Session session, Integer personId, Integer roomId) {
        gameContext.getSessionStorage().put(personId, session);
        Person person = new Person(personId);
        person.setHexColor(locationService.getRandomHexColor());
        person.setInPool(false);//@todo add observers logic
        personService.resetState(person, gameContext.getRoom(roomId));
        addPerson(person, roomId);
    }

    public int addAndIncrementPersonId() {
        return gameContext.getPersonIds().getAndIncrement();
    }

    public void onTextMessage(Session session, String message, Integer personId) {

    }

    public Integer createRoom(Integer mapId, String roomName) {
        return roomService.createRoom(mapId, roomName);
    }

    public void onClose(Integer personId, Integer roomId) {
        removePerson(personId, roomId);
        responseService.flushToAll(new Leave(personId), gameContext.getRoom(0));
    }

    private void tick(Room room) {
        Collection<Person> persons = room.getPersons().values();
        personService.handlePersons(persons, room);
        projectilesService.onProjectileLifecycle(room.getProjectiles());
        responseService.broadcast(
                new Update(
                        responseService.mapPersons(room.getPersons()),
                        responseService.mapProjectiles(room.getProjectiles())
                ),
                room
        );
    }

    private void startTimer(Room room) {
        gameContext.setGameTimer(new Timer(PersonWebSocketEndpoint.class.getSimpleName() + " Timer"));
        gameContext.getGameTimer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    tick(room);
                } catch (RuntimeException e) {
                    System.out.println("Caught to prevent timer from shutting down" + e.getMessage());
                }
            }
        }, Context.TICK_DELAY, Context.TICK_DELAY);
    }


    private synchronized void addPerson(Person person, Integer roomId) {
        Room room = gameContext.getRoom(roomId);
        if (room.getPersons().size() == 0) {
            startTimer(room);
        }
        room.getPersons().put(person.getId(), person);
    }

    private synchronized void removePerson(Integer personId, Integer roomId) {
        gameContext.getRoom(roomId).getPersons().remove(personId);
        if (gameContext.getRoom(roomId).getPersons().size() == 0) {
            stopTimer();
        }
    }

    private void stopTimer() {
        if (gameContext.getGameTimer() != null) {
            gameContext.getGameTimer().cancel();
        }
    }

    public void updatePersonViewAngle(Person person, int direction) {
        turnService.updatePersonViewAngle(person, direction);
    }

    public void handleDirection(Person person, String part) {
        personService.handleDirection(person, part);
    }

    public void doShot(Person person, String status) {
        projectilesService.doShot(person, status);
    }
}
