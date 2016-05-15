package org.forweb.commandos.controller;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.service.SpringDelegationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.server.standard.SpringConfigurator;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.EOFException;

@ServerEndpoint(value = "/commandos", configurator = SpringConfigurator.class)
public class PersonWebSocketEndpoint {

    private static final String MESSAGE_JOIN = "join";
    private static final String MESSAGE_CREATE = "create";
    private static final String MESSAGE_SHOT = "fire";
    private static final String MESSAGE_DIRECTION = "direction";
    private static final String MESSAGE_ANGLE = "angle";

    public static final int PERSON_RADIUS = 20;
    public static final Integer LIFE_AT_START = 100;

    @Autowired
    private SpringDelegationService springDelegationService;
    @Autowired
    private Context gameContext;


    private int id;
    private int roomId;
    private Person person;
    private Session session;
    
    @OnOpen
    public void onOpen(Session session) {
        this.id = springDelegationService.addAndIncrementPersonId();
        this.session = session;
    }

    @OnMessage
    public void onTextMessage(String message) {
        springDelegationService.onTextMessage(session, message, id);
        String[] parts = message.split(":");

        switch ((parts[0])) {
            case MESSAGE_ANGLE:
                springDelegationService.updatePersonViewAngle(getPerson(), Integer.parseInt(parts[1]));
                break;
            case MESSAGE_SHOT:
                springDelegationService.doShot(getPerson(), parts[1], roomId);
                break;
            case MESSAGE_DIRECTION:
                springDelegationService.handleDirection(getPerson(), parts[1]);
                break;
            case MESSAGE_CREATE:
                roomId = springDelegationService.createRoom(Integer.parseInt(parts[1]), parts[2]);
                /** Fall throw*/
            case MESSAGE_JOIN:
                springDelegationService.onJoin(session, id, roomId);
                break;
        }
    }

    @OnClose
    public void onClose() {
        springDelegationService.onClose(id, roomId);
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

    private Person getPerson() {
        if(person == null) {
            person = gameContext.getRoom(roomId).getPersons().get(id);
        }
        return person;
    }
}