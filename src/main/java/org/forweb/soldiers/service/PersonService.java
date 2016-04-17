package org.forweb.soldiers.service;

import org.forweb.soldiers.service.person.MovementService;
import org.forweb.soldiers.service.person.TurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.forweb.soldiers.controller.PersonController;
import org.forweb.soldiers.entity.Direction;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.entity.ammo.Bullet;
import org.forweb.soldiers.entity.ammo.Projectile;
import org.forweb.soldiers.game.Context;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

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
    Random random = new Random();
    @PostConstruct
    public void postConstruct() {
        System.out.println("location service pc");
    }
    public synchronized void kill(Person person, Room room) {
        resetState(person, room);
        //responseService.sendMessage(person, "{\"type\": \"dead\"}");
    }

    public synchronized void reward(Person person) {
        //responseService.sendMessage(person, "{\"type\": \"kill\"}");
    }


    public void resetState(Person person, Room room) {
        person.setDirection(Direction.NONE);
        person.setLife(PersonController.LIFE_AT_START);
        locationService.getRandomLocation(room, person);
    }

    public void remove(Room room, int id) {

    }

    public void handleDirection(Person person, String message) {
        person.setDirection(Direction.valueOf(message.toUpperCase()));
    }

    public void doShot(Person person) {
        ConcurrentHashMap<Integer, Projectile> projectiles = gameContext.getRoom().getProjectiles();
        Projectile projectile = getProjectile(person, gameContext.getRoom());
        Integer id = gameContext.getProjectilesIds().getAndIncrement();
        projectiles.put(id, projectile);
        projectileService.calculateInstantImpacts(person, projectile, gameContext.getRoom());
    }

    private Projectile getProjectile(Person person, Room room) {

        Bullet out = new Bullet(
                person.getX(),
                person.getY(),
                getTurnDirection(person)
        );
        float angle = out.getAngle();
        if(angle == 90) {
            out.setxEnd(person.getX());
            out.setyEnd(room.getHeight());
        } else if(angle == 270) {
            out.setxEnd(person.getX());
            out.setyEnd(0);
        } else if(angle < 270 && angle > 90) {
            out.setxEnd(0);
            out.setyEnd((int)(Math.tan(angle * Math.PI / 180) * (- person.getX()) + person.getY()));
        } else {
            out.setxEnd(room.getWidth());
            out.setyEnd((int)(Math.tan(angle * Math.PI / 180) * (room.getWidth() - person.getX()) + person.getY()));
        }
        return out;
    }
    
    private float getTurnDirection(Person person) {
        float spread = (float) person.getWeapon().getSpread();
        
        return person.getAngle() + random.nextFloat() * (spread * 2) - spread;
    }

    public void handlePersons(Collection<Person> persons, Room room) {
        for (Person person : persons) {
            movementService.onMove(person, room);
            movementService.handleCollisions(room.getPersons().values());
            turnService.onPersonChangeViewAngle(person);
        }
    }
}
