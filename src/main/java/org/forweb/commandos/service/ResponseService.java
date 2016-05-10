package org.forweb.commandos.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.ammo.Projectile;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.Update;
import org.forweb.commandos.response.dto.BulletDto;
import org.forweb.commandos.response.dto.OwnerDto;
import org.forweb.commandos.response.dto.PersonDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.websocket.CloseReason;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

        /*List<String> lines = Arrays.asList(message.split("\n"));
        Path file = Paths.get("/var/log/the-file-name.txt");
        try {
            Files.write(file, lines, Charset.forName("UTF-8"), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            e.printStackTrace();
        }*/
        for (Person person : room.getPersons().values()) {
            if(!person.isInPool()) {
                try {
                    update.setOwner(mapOwner(person));
                    String message = prepareJson(update);
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
    }


    private OwnerDto mapOwner(Person person) {
        OwnerDto out = new OwnerDto();
        out.setId(person.getId());
        out.setArmor(person.getArmor());
        out.setLife(person.getLife());
        out.setGuns(person.getWeaponList().stream()
                .map((v) -> v.getName() + ":" + v.getTotalClip() + ":" + v.getCurrentClip())
                .collect(Collectors.toList())
        );
        out.setScore(person.getScore());
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

    public List<PersonDto> mapPersons(ConcurrentHashMap<Integer, Person> persons) {
        List<PersonDto> out = new ArrayList<>(persons.size());
        for (Person person : persons.values()) {
            PersonDto dto = new PersonDto();
            dto.setColor(person.getHexColor());
            dto.setReload(person.isReload() ? 1 : null);
            dto.setGun(person.getWeapon().getName());
            dto.setX(person.getX());
            dto.setY(person.getY());
            dto.setAngle(person.getAngle());
            dto.setId(person.getId());
            out.add(dto);
        }
        return out;
    }

    public List<BulletDto> mapProjectiles(ConcurrentHashMap<Integer, Projectile> projectiles) {
        List<BulletDto> out = new ArrayList<>(projectiles.size());
        for (Projectile projectile : projectiles.values()) {
            BulletDto dto = new BulletDto();
            dto.setX1(projectile.getxStart());
            dto.setY1(projectile.getyStart());
            if (projectile.isInstant()) {
                dto.setX2(projectile.getxEnd());
                dto.setY2(projectile.getyEnd());
            }
            dto.setType(projectile.getName());
            out.add(dto);
        }
        return out;
    }
}
