package org.forweb.soldiers.service;

import org.forweb.soldiers.controller.PersonWebSocketEndpoint;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.game.Context;
import org.forweb.soldiers.response.Leave;
import org.forweb.soldiers.response.Update;
import org.forweb.soldiers.service.person.TurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.Collection;
import java.util.Timer;
import java.util.TimerTask;

@Service
public class SpringDelegationService {

    private static final String MESSAGE_JOIN = "join";
    private static final String MESSAGE_SHOT = "fire";
    private static final String MESSAGE_DIRECTION = "direction";
    private static final String MESSAGE_ANGLE = "angle";

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


    private void onOpen(Session session, Integer personId) {
        gameContext.getSessionStorage().put(personId, session);
        Person person = new Person(personId);
        person.setHexColor(locationService.getRandomHexColor());
        personService.resetState(person, gameContext.getRoom(0));
        addPerson(person);
    }

    public int addAndIncrementPersonId() {
        return gameContext.getPersonIds().getAndIncrement();
    }

    public void onTextMessage(Session session, String message, Integer personId) {
        Person person = gameContext.getRoom(0).getPersons().get(personId);
        String[] parts = message.split(":");
        switch ((parts[0])) {
            case MESSAGE_ANGLE:
                turnService.updatePersonViewAngle(person, Integer.parseInt(parts[1]));
                break;
            case MESSAGE_SHOT:
                projectilesService.doShot(person, parts[1]);
                break;
            case MESSAGE_DIRECTION:
                personService.handleDirection(person, parts[1]);
                break;
            case MESSAGE_JOIN:
                onOpen(session, personId);
                break;
        }
    }

    public void onClose(Integer personId) {
        removePerson(personId);
        responseService.flushToAll(new Leave(personId), gameContext.getRoom(0));
    }

    private void tick() {
        Collection<Person> persons = gameContext.getRoom(0).getPersons().values();
        personService.handlePersons(persons, gameContext.getRoom(0));
        projectilesService.onProjectileLifecycle(gameContext.getRoom(0).getProjectiles());
        Room room = gameContext.getRoom(0);
        responseService.broadcast(
                new Update(
                    responseService.mapPersons(gameContext.getRoom(0).getPersons()),
                    responseService.mapProjectiles(gameContext.getRoom(0).getProjectiles())
                ),
                room
        );
    }

    private void startTimer() {
        gameContext.setGameTimer(new Timer(PersonWebSocketEndpoint.class.getSimpleName() + " Timer"));
        gameContext.getGameTimer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    tick();
                } catch (RuntimeException e) {
                    System.out.println("Caught to prevent timer from shutting down" + e.getMessage());
                }
            }
        }, Context.TICK_DELAY, Context.TICK_DELAY);
    }


    private synchronized void addPerson(Person person) {
        if (gameContext.getRoom(0).getPersons().size() == 0) {
            startTimer();
        }
        gameContext.getRoom(0).getPersons().put(person.getId(), person);
    }

    private synchronized void removePerson(Integer personId) {
        gameContext.getRoom(0).getPersons().remove(personId);
        if (gameContext.getRoom(0).getPersons().size() == 0) {
            stopTimer();
        }
    }

    private void stopTimer() {
        if (gameContext.getGameTimer() != null) {
            gameContext.getGameTimer().cancel();
        }
    }
}
