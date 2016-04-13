package org.forweb.soldiers.service;

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
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PersonService {
    
    @Autowired
    LocationService locationService;
    @Autowired
    ResponseService responseService;
    @Autowired
    ProjectileService projectileService;

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

    public synchronized void reward(Person person) {
        //responseService.sendMessage(person, "{\"type\": \"kill\"}");
    }

    private synchronized void onPersonMove(Person person, Room room) {
        Direction direction = person.getDirection();
        int x = person.getX();
        int y = person.getY();
        if (direction != null) {
            switch (direction) {
                case EAST:
                    if (locationService.canGoEast(x, room.getWidth())) {
                        person.setX(++x);
                    }
                    break;
                case WEST:
                    if (locationService.canGoWest(x)) {
                        person.setX(--x);
                    }
                    break;
                case NORTH:
                    if (locationService.canGoNorth(y)) {
                        person.setY(--y);
                    }
                    break;
                case SOUTH:
                    if (locationService.canGoSouth(y, room.getHeight())) {
                        person.setY(++y);
                    }
                    break;
                case SOUTH_WEST:
                    if (locationService.canGoSouth(y, room.getHeight())) {
                        person.setY(++y);
                    }
                    if (locationService.canGoWest(x)) {
                        person.setX(--x);
                    }
                    break;
                case SOUTH_EAST:
                    if (locationService.canGoSouth(y, room.getHeight())) {
                        person.setY(++y);
                    }
                    if (locationService.canGoEast(x, room.getWidth())) {
                        person.setX(++x);
                    }
                    break;
                case NORTH_WEST:
                    if (locationService.canGoNorth(y)) {
                        person.setY(--y);
                    }
                    if (locationService.canGoWest(x)) {
                        person.setX(--x);
                    }
                    break;
                case NORTH_EAST:
                    if (locationService.canGoNorth(y)) {
                        person.setY(--y);
                    }
                    if (locationService.canGoEast(x, room.getWidth())) {
                        person.setX(++x);
                    }
                    break;
                default:
                    //do nothing
            }
        }
        handleCollisions(room.getPersons().values());
    }

    private void handleCollisions(Collection<Person> snakes) {
        for (Person snake : snakes) {
            /*boolean headCollision = id != snake.id && snake.getLocation().equals(head);
            if (headCollision || tailCollision) {
                kill();
                if (id != snake.id) {
                    snake.reward();
                }
            }*/
        }
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

    public void doShot(Person person, int x, int y) {
        ConcurrentHashMap<Integer, Projectile> projectiles = gameContext.getRoom().getProjectiles();
        Projectile projectile = getProjectile(person, x, y);
        Integer id = gameContext.getProjectilesIds().getAndIncrement();
        projectiles.put(id, projectile);
        projectileService.calculateInstantImpacts(person, projectile, gameContext.getRoom());
    }

    private Projectile getProjectile(Person person, int x, int y) {
        return new Bullet(
                person.getX(),
                person.getY(),
                x,
                y
        );
    }

    public void handlePersons(Collection<Person> persons, Room room) {
        for (Person person : persons) {
            onPersonMove(person, gameContext.getRoom());
            onPersonChangeViewAngle(person);
        }
    }

    private void onPersonChangeViewAngle(Person person) {

        float angle;
        if(person.getTurnDirection() > 0) {
            angle = person.getAngle() + 2;
        } else if(person.getTurnDirection() < 0) {
            angle = person.getAngle() - 2;
        } else {
            angle = person.getAngle();
        }
        if(angle > 360) {
            angle = 0;
        } else if (angle < 0) {
            angle = 360;
        }
        person.setAngle(angle);
    }

    public void updatePersonViewAngle(Person person, int direction) {
        person.setTurnDirection(direction == 0 ? 0 : (direction > 0 ? 1 : -1));
    }
}
