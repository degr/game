package org.forweb.commandos.controller;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.Status;
import org.forweb.commandos.service.CmdService;
import org.forweb.commandos.service.SpringDelegationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.server.standard.SpringConfigurator;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.EOFException;
import java.util.Random;

@ServerEndpoint(value = "/commandos", configurator = SpringConfigurator.class)
public class PersonWebSocketEndpoint {

    private static final String MESSAGE_JOIN = "join";
    private static final String MESSAGE_CREATE = "create";
    private static final String MESSAGE_SHOT = "fire";
    private static final String MESSAGE_RELOAD = "reload";
    private static final String MESSAGE_DIRECTION = "direction";
    private static final String MESSAGE_ANGLE = "angle";
    private static final String MESSAGE_MESSAGE = "message";
    private static final String MESSAGE_CHANGE_WEAPON = "gun";
    private static final String MESSAGE_READY = "ready";
    private static final String MESSAGE_TEAM = "team";
    private static final String MESSAGE_NO_PASSIVE_RELOAD = "noPassiveReload";
    private static final String MESSAGE_RESTART = "restart";
    private static final String MESSAGE_CMD = "cmd";

    public static final int PERSON_RADIUS = 20;
    public static final int ROCKET_RADIUS = 8;
    public static final int FIRE_RADIUS = 8;
    public static final Integer LIFE_AT_START = 100;

    public static final long FRAME_RATE = 1000/60;
    public static final double MOVEMENT_SPEED = 4;

    public static final int CLUSTER_SIZE = 100;

    @Autowired
    private SpringDelegationService springDelegationService;
    @Autowired
    private Context gameContext;


    private int id;
    private int roomId;
    private Person person;
    private Session session;
    @Autowired
    private CmdService cmdService;

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
    }

    @OnMessage
    public void onTextMessage(String message) {
        /*List<String> lines = Arrays.asList(message.split("\n"));
        Path file = Paths.get("/var/log/!in-commandos.txt");
        try {
            Files.write(file, lines, Charset.forName("UTF-8"), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            e.printStackTrace();
        }*/

        if (message.startsWith(MESSAGE_MESSAGE)) {
            springDelegationService.onTextMessage(message, roomId, id);
            if (message.startsWith(MESSAGE_MESSAGE + ":\n" + MESSAGE_CMD)) {
                cmdService.onCmd(getPerson(), roomId, message.substring(message.indexOf(":\n") + 2).split(" "));
            }
            return;
        }
        if (personInPull()) {
            return;
        }
        String[] parts = message.split(":");
        Room room = gameContext.getRoom(roomId);


        switch ((parts[0])) {
            case MESSAGE_ANGLE:
                springDelegationService.updatePersonViewAngle(getPerson(), Float.parseFloat(parts[1]));
                break;
            case MESSAGE_DIRECTION:
                springDelegationService.handleDirection(getPerson(), parts[1]);
                break;
            case MESSAGE_SHOT:
                springDelegationService.doShot(getPerson(), parts[1], roomId);
                break;
            case MESSAGE_CHANGE_WEAPON:
                springDelegationService.changeWeapon(getPerson(), Integer.parseInt(parts[1]));
                break;
            case MESSAGE_RELOAD:
                springDelegationService.reloadWeapon(getPerson());
                break;
            case MESSAGE_NO_PASSIVE_RELOAD:
                getPerson().setNoPassiveReload("1".equals(parts[1]));
                break;
            case MESSAGE_READY:
                springDelegationService.onReady(getPerson(), roomId, "1".equals(parts[1]));
                break;
            case MESSAGE_TEAM:
                springDelegationService.onChangeTeam(getPerson(), roomId, Integer.parseInt(parts[1]));
                break;
            case MESSAGE_RESTART:
                if (room != null && getPerson() != null && getPerson().getStatus().equals(Status.stats)) {
                    springDelegationService.onRestart(person, room);
                }
                break;
            case MESSAGE_CREATE:
                String roomName;
                String username;
                if (parts.length < 4) {
                    Random r = new Random();
                    username = "player-" + (r.nextInt(998) + 1);
                    if (parts.length < 3) {
                        roomName = "unnamed-room-" + (r.nextInt(998) + 1);
                    } else {
                        roomName = parts[2];
                    }
                } else {
                    username = parts[3];
                    roomName = parts[2];
                }
                roomId = springDelegationService.createRoom(Integer.parseInt(parts[1]), roomName);
                initPersonId(roomId);
                springDelegationService.onJoin(session, id, roomId, username);
                break;
            case MESSAGE_JOIN:
                String personNameJoin;
                if (parts.length < 3) {
                    Random r = new Random();
                    personNameJoin = "player-" + (r.nextInt(998) + 1);
                } else {
                    personNameJoin = parts[2];
                }
                roomId = Integer.parseInt(parts[1]);
                initPersonId(roomId);
                springDelegationService.onJoin(session, id, roomId, personNameJoin);
                break;
        }
    }

    private boolean personInPull() {
        return person != null && person.isInPool();
    }

    private void initPersonId(int roomId) {
        this.id = gameContext.getRoom(roomId).getPersonIds().getAndIncrement();
        ;
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
        if (person == null) {
            Room room = gameContext.getRoom(roomId);
            if (room != null) {
                person = room.getPersons().get(id);
            }
        }
        return person;
    }
}