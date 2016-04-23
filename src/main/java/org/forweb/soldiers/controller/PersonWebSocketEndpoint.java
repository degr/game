package org.forweb.soldiers.controller;

import org.forweb.soldiers.service.SpringDelegationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.server.standard.SpringConfigurator;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.EOFException;

@ServerEndpoint(value = "/soldiers", configurator = SpringConfigurator.class)
public class PersonWebSocketEndpoint {


    public static final int PERSON_RADIUS = 15;
    public static final Integer LIFE_AT_START = 100;

    @Autowired
    private SpringDelegationService springDelegationService;


    private int id;
    private Session session;
    
    @OnOpen
    public void onOpen(Session session) {
        this.id = springDelegationService.addAndIncrementPersonId();
        this.session = session;
    }

    @OnMessage
    public void onTextMessage(String message) {
        springDelegationService.onTextMessage(session, message, id);
    }


    @OnClose
    public void onClose() {
        springDelegationService.onClose(id);
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
}