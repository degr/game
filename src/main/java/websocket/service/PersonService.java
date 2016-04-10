package websocket.service;

import websocket.controller.PersonController;
import websocket.entity.Direction;
import websocket.entity.Location;
import websocket.entity.Person;
import websocket.entity.Room;
import websocket.entity.ammo.Bullet;
import websocket.entity.ammo.Projectile;
import websocket.game.Context;
import websocket.response.Update;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.concurrent.ConcurrentHashMap;

public class PersonService {

    LocationService locationService = new LocationService();
    ResponseService responseService = ResponseService.getInstance();
    Context gameContext = Context.getInstance();


    private synchronized void kill(Person person, Room room) {
        resetState(person, room);
        responseService.sendMessage(person, "{\"type\": \"dead\"}");
    }

    private synchronized void reward(Person person) {
        responseService.sendMessage(person, "{\"type\": \"kill\"}");
    }

    public synchronized void onPersonMove(Person person, Room room) {
        Direction direction = person.getDirection();
        Location location = person.getLocation();
        int x = location.getX();
        int y = location.getY();
        if (direction != null) {
            switch (direction) {
                case EAST:
                    if(locationService.canGoEast(x, room.getWidth())) {
                        location.setX(++x);
                    }
                    break;
                case WEST:
                    if(locationService.canGoWest(x)) {
                        location.setX(--x);
                    }
                    break;
                case NORTH:
                    if(locationService.canGoNorth(y)){
                        location.setY(--y);
                    }
                    break;
                case SOUTH:
                    if(locationService.canGoSouth(y, room.getHeight())) {
                        location.setY(++y);
                    }
                    break;
                case SOUTH_WEST:
                    if(locationService.canGoSouth(y, room.getHeight())) {
                        location.setY(++y);
                    }
                    if(locationService.canGoWest(x)) {
                        location.setX(--x);
                    }
                    break;
                case SOUTH_EAST:
                    if(locationService.canGoSouth(y, room.getHeight())) {
                        location.setY(++y);
                    }
                    if(locationService.canGoEast(x, room.getWidth())) {
                        location.setX(++x);
                    }
                    break;
                case NORTH_WEST:
                    if(locationService.canGoNorth(y)) {
                        location.setY(--y);
                    }
                    if(locationService.canGoWest(x)) {
                        location.setX(--x);
                    }
                    break;
                case NORTH_EAST:
                    if(locationService.canGoNorth(y)) {
                        location.setY(--y);
                    }
                    if(locationService.canGoEast(x, room.getWidth())) {
                        location.setX(++x);
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

    public void resetState(Person snake, Room room) {
        snake.setDirection(Direction.NONE);
        snake.setLocation(locationService.getRandomLocation(room));
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
    }
    
    private Projectile getProjectile(Person person, int x, int y){
        Location personLocation = person.getLocation();
        
        return new Bullet(
                personLocation.getX(),
                personLocation.getY(),
                x,
                y
        );
    }
}
