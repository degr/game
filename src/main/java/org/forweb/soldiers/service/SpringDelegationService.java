package org.forweb.soldiers.service;

import org.forweb.soldiers.controller.PersonController;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.game.Context;
import org.forweb.soldiers.response.Join;
import org.forweb.soldiers.response.Leave;
import org.forweb.soldiers.response.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.Collection;
import java.util.Timer;
import java.util.TimerTask;

@Service
public class SpringDelegationService {

    private static final String MESSAGE_JOIN = "join";
    private static final String MESSAGE_SHOT = "shot";
    private static final String MESSAGE_DIRECTION = "direction";
    private static final String MESSAGE_ANGLE = "angle";
    
    @Autowired
    private Context gameContext;
    @Autowired
    private LocationService locationService;
    @Autowired
    private PersonService personService;
    @Autowired
    private ResponseService responseService;
    @Autowired
    private ProjectileService projectilesService;


    public void onOpen(Session session, Integer personId, String clientKey) {
        gameContext.getSessionStorage().put(personId, session);
        Person person = new Person(personId, clientKey);
        person.setHexColor(locationService.getRandomHexColor());
        
        personService.resetState(person, gameContext.getRoom());
        addPerson(person);
        Join join = new Join();
        join.setId(person.getId());
        join.setPerson(person);
        broadcast(responseService.prepareJson(join));
    }

    public int addAndIncrementPersonId() {
        return gameContext.getPersonIds().getAndIncrement();
    }

    public void onTextMessage(Session session, String message, Integer personId) {
        Person person = gameContext.getRoom().getPersons().get(personId);
        String[] parts = message.split(":");
        switch ((parts[0])) {
            case MESSAGE_ANGLE:
                personService.updatePersonViewAngle(person, Integer.parseInt(parts[1]));
                break;
            case MESSAGE_SHOT:
                personService.doShot(person, Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
                break;
            case MESSAGE_DIRECTION:
                personService.handleDirection(person, parts[1]);
                break;
            case MESSAGE_JOIN:
                onOpen(session, personId, parts[1]);
                break;
        }
    }

    public void onClose(Integer personId) {
        removePerson(personId);
        broadcast(responseService.prepareJson(
                new Leave(personId)
        ));
    }


    protected void broadcast(String message) {
        for (Person snake : gameContext.getRoom().getPersons().values()) {
            try {
                responseService.sendMessage(snake, message);
            } catch (IllegalStateException ise) {
                // An ISE can occur if an attempt is made to write to a
                // WebSocket connection after it has been closed. The
                // alternative to catching this exception is to synchronise
                // the writes to the clients along with the addPerson() and
                // removePerson() methods that are already synchronised.
            }
        }
    }


    protected void tick() {
        Collection<Person> persons = gameContext.getRoom().getPersons().values();
        personService.handlePersons(persons, gameContext.getRoom());
        projectilesService.onProjectileLifecycle(gameContext.getRoom().getProjectiles());
        broadcast(responseService.prepareJson(
                new Update(
                        gameContext.getRoom().getPersons().values(),
                        gameContext.getRoom().getProjectiles().values()
                )
        ));
    }

    public void startTimer() {
        gameContext.setGameTimer(new Timer(PersonController.class.getSimpleName() + " Timer"));
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


    protected synchronized void addPerson(Person person) {
        if (gameContext.getRoom().getPersons().size() == 0) {
            startTimer();
        }
        gameContext.getRoom().getPersons().put(person.getId(), person);
    }

    protected synchronized void removePerson(Integer personId) {
        gameContext.getRoom().getPersons().remove(personId);
        if (gameContext.getRoom().getPersons().size() == 0) {
            stopTimer();
        }
    }
    
    public void stopTimer() {
        if (gameContext.getGameTimer() != null) {
            gameContext.getGameTimer().cancel();
        }
    }
}
