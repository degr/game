package org.forweb.commandos.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.entity.ammo.Shot;
import org.forweb.commandos.entity.ammo.SubShot;
import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.zone.AbstractItem;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.GameStats;
import org.forweb.commandos.response.Update;
import org.forweb.commandos.response.dto.OwnerDto;
import org.forweb.commandos.response.dto.Stats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.CloseReason;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ResponseService {

    @Autowired
    private Context gameContext;

    public void sendMessage(Person person, String msg) {
        try {
            gameContext.getSession(person.getId()).getBasicRemote().sendText(msg);
        } catch (IOException ioe) {
            CloseReason cr = new CloseReason(CloseReason.CloseCodes.CLOSED_ABNORMALLY, ioe.getMessage());
            try {
                gameContext.getSession(person.getId()).close(cr);
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

        /*boolean dumpToFile = false;*/
        for (Person person : room.getPersons().values()) {
            try {
                update.setOwner(mapOwner(person));
                String message = prepareJson(update);

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
                sendMessage(person, message);
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
        room.setMessages(new ArrayList<>());
    }

    public void sendStats(List<Stats> stats, Room room) {
        GameStats out = new GameStats();
        out.setStats(stats);
        String message = prepareJson(out);
        for (Person person : room.getPersons().values()) {
            try {
                sendMessage(person, message);
            } catch (IllegalStateException ise) {
            }
        }
    }


    private OwnerDto mapOwner(Person person) {
        if (person.isInPool()) {
            return null;
        }
        OwnerDto out = new OwnerDto();
        out.setOwner(person.doResponse());

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
                sendMessage(person, message);
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
                out.add(person.doCommonResponse());
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
            if (zone instanceof AbstractItem) {
                AbstractItem item = (AbstractItem) zone;
                if (item.isAvailable()) {
                    out.add(item.getId());
                }
            }
        }
        return out;
    }
}
