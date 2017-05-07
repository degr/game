package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.Vote;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.Leave;
import org.forweb.commandos.response.Status;
import org.forweb.commandos.response.Update;
import org.forweb.commandos.service.person.TurnService;
import org.forweb.commandos.thread.RoomShootDownThread;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.Session;
import java.util.Collection;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

@Service
public class SpringDelegationService {

    @Autowired
    private Context gameContext;
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
    @Autowired
    private LocationService locationService;


    public void onJoin(Session session, Integer personId, Integer roomId, String name) {
        Room room = gameContext.getRoom(roomId);
        Person player = new Person(personId);
        if (room.getPersons().size() >= room.getMaxPlayers()) {
            player.setInPool(true);
        } else {
            room.setTotalPlayers(room.getTotalPlayers() + 1);
            player.setInPool(false);
            room.getMessages().add("0:" + name + " just now joined game");
            if(!Map.GameType.dm.toString().equals(room.getMap().getGameType()) && room.isEverybodyReady()) {
                int blue = 0;
                int red = 0;
                for(Person person :  room.getPersons().values()) {
                    if(person.getTeam() == 1) {
                        red++;
                    } else {
                        blue ++;
                    }
                }
                if(red > blue) {
                    player.setTeam(2);
                } else if (blue > red) {
                    player.setTeam(1);
                } else {
                    player.setTeam(new Random().nextInt(2) + 1);
                }
            }
        }
        room.getSessionStorage().put(personId, session);
        player.setName(name);
        PersonService.resetState(player, gameContext.getRoom(roomId));
        room.getPersons().put(player.getId(), player);
    }

    public void onTextMessage(String message, int roomId, Integer personId) {
        Room room = gameContext.getRoom(roomId);
        Person person = room.getPersons().get(personId);
        if (!person.isInPool()) {
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

        if (room.isEverybodyReady() && room.getEndTime() - System.currentTimeMillis() < 0) {
            room.setShowStats(true);
            room.setEverybodyReady(false);
            for(Person person : room.getPersons().values()) {
                person.setStatus(Status.stats);
                person.setReady(false);
            }
        }

        Collection<Person> persons = room.getPersons().values();
        if (room.isShowStats()) {
            if (persons.size() == 0) {
                gameContext.getRooms().remove(room.getId());
                room.getGameTimer().cancel();
            }

        }
        personService.handlePersons(persons, room);
        projectilesService.onProjectileLifecycle(room.getProjectiles(), room);
        mapService.onItemsLifecycle(room.getMap().getZones());


        Vote vote = room.getVote();
        if(vote != null) {
            if(vote.isOld()) {
                room.setVote(null);
                room.getMessages().add("0:Vote time remain.");
            } else {
                if(vote.isReady(room)) {
                    vote.process(room);
                    room.getMessages().add("0:Vote applied");
                    room.setVote(null);
                } else {
                    room.getVote().onRemind(room);
                }
            }
        }
    }

    private void startTimer(Room room) {
        room.setGameTimer(new Timer(PersonWebSocketEndpoint.class.getSimpleName() + " Timer " + new Random().nextDouble()));

        room.getGameTimer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    int personsCount = room.getPersons().size();
                    if(personsCount < 1) {
                        if(!room.isShootingDown()) {
                            room.setShootingDown(true);
                            (new RoomShootDownThread(room, gameContext.getRooms())).start();
                        }
                        return;
                    }
                    tick(room);
                    responseService.broadcast(
                            new Update(
                                    responseService.mapPersons(room.getPersons()),
                                    responseService.mapProjectiles(room.getProjectiles()),
                                    responseService.mapItems(room.getMap().getZones()),
                                    room.getMessages(),
                                    room.isEverybodyReady() ? room.getEndTime() - System.currentTimeMillis() : 0,
                                    room.isEverybodyReady(),
                                    responseService.mapTempZones(room.getMap().getZones()),
                                    room.getTeam1Score() + ":" + room.getTeam2Score(),
                                    responseService.mapBlood(room.getBloodList()),
                                    (room.isDumpMap() ? room.getMap() : null)
                            ),
                            room
                    );
                    if(room.isDumpMap()) {
                        room.setDumpMap(false);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("Caught to prevent timer from shutting down" + e.getMessage());
                    room.setTotalPlayers(room.getPersons().size());
                }
            }
        }, PersonWebSocketEndpoint.FRAME_RATE, PersonWebSocketEndpoint.FRAME_RATE);
    }


    private synchronized void removePerson(Integer personId, Integer roomId) {
        Room room = gameContext.getRoom(roomId);
        if (room != null) {
            Person person = room.getPersons().get(personId);
            room.setTotalPlayers(room.getTotalPlayers() - 1);
            if(room.getVote() != null) {
                room.getVote().removeVote(personId);
            }
            if(person != null) {
                if(person.getTeam() == 1) {
                    if(person.isOpponentFlag()) {
                        room.updateFlag(1);
                    }
                    if(person.isSelfFlag()) {
                        room.updateFlag(2);
                    }
                } else if(person.getTeam() == 2) {
                    if(person.isOpponentFlag()) {
                        room.updateFlag(2);
                    }
                    if(person.isSelfFlag()) {
                        room.updateFlag(1);
                    }
                } else {
                    //it must never happen
                    if(person.isOpponentFlag() || person.isSelfFlag()) {
                        room.updateFlag(1);
                        room.updateFlag(2);
                    }
                }

            }
            room.getPersons().remove(personId);
        }
    }

    public void updatePersonViewAngle(Person person, float direction) {
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

    public void reloadWeapon(Person person) {
        if (!person.isReload() && person.getWeapon().getCurrentClip() != person.getWeapon().getClipSize()) {
            projectilesService.doReload(person, System.currentTimeMillis());
        }
    }

    public void onChangeTeam(Person person, int roomId, int team) {
        Room room = gameContext.getRoom(roomId);
        if (room.isCoOp()) {
            if (team == 1) {
                room.getMessages().add("0:" + person.getName() + " join to RED team");
                person.setTeam(1);
            } else {
                room.getMessages().add("0:" + person.getName() + " join to BLUE team");
                person.setTeam(2);
            }
        }
    }

    public void onReady(Person person, int roomId, boolean ready) {
        Room room = gameContext.getRoom(roomId);
        boolean isRoomReady = room.isEverybodyReady();
        person.setReady(ready);
        roomService.onPersonReady(room);
        if(!isRoomReady){
            if(room.isEverybodyReady()) {
                personService.resetPersonsOnRoomReady(room);
                locationService.resetLocationsOnRoomReady(room);
                room.getMessages().add("0:Game started just now");
            } else {
                String message = ready ? " is ready to kill. How about you?" : " not ready";
                room.getMessages().add("0:" + person.getName() + message);
            }
        }
    }

    public void onRestart(Person person, Room room) {
        RoomService.setMapToRoom(room, room.getMap(), true);
        PersonService.resetState(person, room);
        person.setStatus(Status.alive);
    }
}
