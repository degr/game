package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Direction;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.entity.weapon.Knife;
import org.forweb.commandos.entity.weapon.Pistol;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.service.person.MovementService;
import org.forweb.commandos.service.person.TurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class PersonService {
    @Autowired
    MovementService movementService;
    @Autowired
    ResponseService responseService;
    @Autowired
    ProjectileService projectileService;
    @Autowired
    LocationService locationService;
    @Autowired
    TurnService turnService;

    @Autowired
    Context gameContext;

    @PostConstruct
    public void postConstruct() {
        System.out.println("location service pc");
    }

    public synchronized void kill(Person person, Room room) {
        resetState(person, room);
        //responseService.sendMessage(person, "{\"type\": \"dead\"}");
    }

    public synchronized void reward(Person shooter, Person target) {
        if (shooter == target) {
            shooter.setScore(shooter.getScore() - 1);
        } else {
            shooter.setScore(shooter.getScore() + 1);
        }
    }


    public void resetState(Person person, Room room) {
        person.setDirection(Direction.NONE);
        person.setLife(PersonWebSocketEndpoint.LIFE_AT_START);
        Respawn respawn = locationService.getRespawn(room, person);
        if (respawn == null) {
            throw new RuntimeException("No respawn points on map");
        } else {
            person.setLastRespawnId(respawn.getId());
            person.setX(respawn.getX() + PersonWebSocketEndpoint.PERSON_RADIUS);
            person.setY(respawn.getY() + PersonWebSocketEndpoint.PERSON_RADIUS);
        }
        person.setWeapon(new Pistol());
        List<AbstractWeapon> weaponList = new ArrayList<>();
        weaponList.add(new Knife());
        weaponList.add(person.getWeapon());
        person.setWeaponList(weaponList);
        person.setReloadCooldown(0);
        person.setReload(false);
    }

    public void remove(Room room, int id) {

    }

    public void handleDirection(Person person, String message) {
        person.setDirection(Direction.valueOf(message.toUpperCase()));
    }

    public void handlePersons(Collection<Person> persons, Room room) {
        long now = System.currentTimeMillis();
        for (Person person : persons) {
            movementService.onMove(person, room);
            projectileService.onReload(person, now);
            projectileService.handleFire(person, room);
            turnService.onPersonChangeViewAngle(person);
        }
    }
}
