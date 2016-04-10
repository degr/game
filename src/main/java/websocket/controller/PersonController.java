/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package websocket.controller;

import websocket.entity.Person;
import websocket.game.Context;
import websocket.response.Join;
import websocket.response.Leave;
import websocket.response.Update;
import websocket.service.LocationService;
import websocket.service.PersonService;
import websocket.service.ProjectileService;
import websocket.service.ResponseService;

import javax.servlet.annotation.WebListener;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.EOFException;
import java.util.*;

@WebListener
@ServerEndpoint(value = "/examples/websocket/snake")
public class PersonController {
    
    private static final String MESSAGE_SHOT = "shot"; 
    private static final String MESSAGE_DIRECTION = "direction"; 
    
    
    public static final int PERSON_RADIUS = 15;
    Context gameContext = Context.getInstance();
    LocationService locationService = new LocationService();
    PersonService personService = new PersonService();
    ResponseService responseService = ResponseService.getInstance();
    private ProjectileService projectilesService = ProjectileService.getInstance();
    
    private final int id;
    private Person person;

    public PersonController() {
        this.id = gameContext.getPersonIds().getAndIncrement();
    }


    @OnOpen
    public void onOpen(Session session) {
        gameContext.getSessionStorage().put(id, session);
        person = new Person(id, locationService.getRandomHexColor());
        
        personService.resetState(person, gameContext.getRoom());
        addPerson(person);
        Join join = new Join();
        join.setId(person.getId());
        join.setData(gameContext.getRoom().getPersons().values());
        
        broadcast(responseService.prepareJson(join));
        
        /*
        StringBuilder sb = new StringBuilder();
        for (Iterator<Person> iterator = gameContext.getRoom().getPersons().values().iterator();
             iterator.hasNext(); ) {
            Person person = iterator.next();
            sb.append(String.format("{\"id\": %d, \"color\": \"%s\"}", person.getId(), person.getHexColor()));
            if (iterator.hasNext()) {
                sb.append(',');
            }
        }
        broadcast(String.format("{\"type\": \"join\",\"id\":"+ person.getId()+",\"data\":[%s]}",
                sb.toString()));*/
    }


    @OnMessage
    public void onTextMessage(String message) {
        String[] parts = message.split(":");
        switch ((parts[0])) {
            case MESSAGE_SHOT:
                personService.doShot(person, Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
                break;
            case MESSAGE_DIRECTION:
                personService.handleDirection(person, parts[1]);
                break;
        }
    }


    @OnClose
    public void onClose() {
        removeSnake(person);
        broadcast(responseService.prepareJson(
                new Leave(person.getId())
        ));
    }


    @OnError
    public void onError(Throwable t) throws Throwable {
        // Most likely cause is a user closing their browser. Check to see if
        // the root cause is EOF and if it is ignore it.
        // Protect against infinite loops.
        int count = 0;
        Throwable root = t;
        while (root.getCause() != null && count < 20) {
            root = root.getCause();
            count++;
        }
        if (!(root instanceof EOFException)) {
            throw t;
        }
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
                // removeSnake() methods that are already synchronised.
            }
        }
    }


    protected void tick() {
        Collection<Person> persons = gameContext.getRoom().getPersons().values();
        for(Person person : persons) {
            personService.onPersonMove(person, gameContext.getRoom());
            projectilesService.onProjectileLifecicle(gameContext.getRoom().getProjectiles());
            broadcast(responseService.prepareJson(
                    new Update(
                            gameContext.getRoom().getPersons().values(),
                            gameContext.getRoom().getProjectiles().values()
                    )
            ));
        }
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

    protected synchronized void removeSnake(Person snake) {
        gameContext.getRoom().getPersons().remove(snake.getId());
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