package org.forweb.commandos.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.forweb.commandos.entity.*;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.Shot;
import org.forweb.commandos.entity.ammo.SubShot;
import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.GameStats;
import org.forweb.commandos.response.Status;
import org.forweb.commandos.response.Update;
import org.forweb.commandos.response.dto.OwnerDto;
import org.forweb.commandos.response.dto.Stats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.CloseReason;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ResponseService {

    @Autowired
    private Context gameContext;

    public void sendMessage(Room room, Person person, String msg) {
        try {
            room.getSession(person.getId()).getBasicRemote().sendText(msg);
        } catch (IOException ioe) {
            CloseReason cr = new CloseReason(CloseReason.CloseCodes.CLOSED_ABNORMALLY, ioe.getMessage());
            try {
                room.getSession(person.getId()).close(cr);
            } catch (IOException ioe2) {
                // Ignore
            }
        }
    }

    private String prepareJson(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void broadcast(Update update, Room room) {
        String statsMessage = null;
        /*boolean dumpToFile = false;*/
        for (Person person : room.getPersons().values()) {
            try {
                if(Status.stats.equals(person.getStatus())) {
                    if(statsMessage == null) {
                        statsMessage = prepareStats(room);
                    }
                    sendMessage(room, person, statsMessage);
                } else {
                    update.setOwner(mapOwner(person));
                    String message = prepareJson(update);
                    sendMessage(room, person, message);

                /*if (!dumpToFile) {
                    dumpToFile = true;
                    List<String> lines = Arrays.asList(message.split("\n"));
                    Path file = Paths.get("/var/log/!out-commandos.txt");
                    try {
                        Files.write(file, lines, Charset.forName("UTF-8"), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }*/
                }
            } catch (IllegalStateException ise) {
                // An ISE can occur if an attempt is made to write to a
                // WebSocket connection after it has been closed. The
                // alternative to catching this exception is to synchronise
                // the writes to the clients along with the addPerson() and
                // removePerson() methods that are already synchronised.
            }
        }
        for (Map.Entry<Integer, Projectile> entry : room.getProjectiles().entrySet()) {
            Projectile projectile = entry.getValue();
            if (projectile.isInstant()) {
                room.getProjectiles().remove(entry.getKey());
            }
        }
        room.getBloodList().clear();
        room.getMessages().clear();
    }

    public String prepareStats(Room room) {
        List<Stats> stats = room.getPersons().values().stream()
                .map(v -> {
                    Stats stat = new Stats();
                    stat.setFrags(v.getScore());
                    stat.setPerson(v.getName());
                    return stat;
                })
                .sorted((v1, v2) -> v2.getFrags() - v1.getFrags())
                .collect(Collectors.toList());

        GameStats out = new GameStats();
        out.setStats(stats);
        out.setTeamStats(room.getTeam1Score(), room.getTeam2Score());
        return prepareJson(out);
    }


    private OwnerDto mapOwner(Person person) {
        if (person.isInPool()) {
            return null;
        }
        OwnerDto out = new OwnerDto();
        out.setOwner(new OwnerFacade(person).doResponse());

        out.setGuns(person.getWeaponList().stream()
                .map(AbstractWeapon::doResponse)
                .collect(Collectors.toList())
        );

        return out;
    }

    public void flushToAll(Object object, Room room) {
        String message = prepareJson(object);
        for (Person person : room.getPersons().values()) {
            try {
                sendMessage(room, person, message);
            } catch (IllegalStateException ise) {
                // An ISE can occur if an attempt is made to write to a
                // WebSocket connection after it has been closed. The
                // alternative to catching this exception is to synchronise
                // the writes to the clients along with the addPerson() and
                // removePerson() methods that are already synchronised.
            }
        }
    }

    public List<String> mapPersons(ConcurrentHashMap<Integer, Person> persons) {
        List<String> out = new ArrayList<>(persons.size());
        for (Person person : persons.values()) {
            if (!person.isInPool()) {
                out.add(person.doResponse());
            }
        }
        return out;
    }

    public List<String> mapProjectiles(ConcurrentHashMap<Integer, Projectile> projectiles) {
        List<String> out = new ArrayList<>(projectiles.size());
        for (Projectile projectile : projectiles.values()) {
            if (projectile instanceof Shot) {
                for (SubShot subshot : ((Shot) projectile).getSubShots()) {
                    out.add(subshot.doResponse());
                }
            } else {
                out.add(projectile.doResponse());
            }
        }
        return out;
    }

    public List<Integer> mapItems(List<AbstractZone> zones) {
        Iterator<AbstractZone> iterator = zones.iterator();
        List<Integer> out = new ArrayList<>();
        while (iterator.hasNext()) {
            AbstractZone zone = iterator.next();
            if (zone instanceof Interactive) {
                Interactive item = (Interactive) zone;
                if (item.isAvailable()) {
                    out.add(item.getId());
                }
            }
        }
        return out;
    }

    public List<String> mapTempZones(List<AbstractZone> zones) {
        List<String> out = null;
        for(AbstractZone zone : zones) {
            if(zone instanceof Interactive) {
                if(((Interactive) zone).isTemporary()) {
                    if(zone instanceof WebSocketResponse) {
                        WebSocketResponse response = (WebSocketResponse) zone;
                        if (out == null) {
                            out = new ArrayList<>();
                        }
                        out.add(response.doResponse());
                    } else {
                        throw new RuntimeException("Temporary zone can't be sended to client : " + zone.getType());
                    }
                }
            }
        }
        return out;
    }

    public List<String> mapBlood(List<Blood> bloodList) {
        if(bloodList.size() == 0) {
            return null;
        }
        List<String> out = new ArrayList<>();
        for(Blood blood : bloodList) {
            out.add(blood.doResponse());
        }
        return out;
    }
}
