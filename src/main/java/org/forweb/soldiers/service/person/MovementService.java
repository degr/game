package org.forweb.soldiers.service.person;

import org.forweb.soldiers.entity.Direction;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovementService {

    @Autowired
    LocationService locationService;
    
    public void onMove(Person person, Room room){

        Direction direction = person.getDirection();
        int x = person.getX();
        int y = person.getY();
        if (direction != null) {
            switch (direction) {
                case EAST:
                    if (locationService.canGoEast(person, room)) {
                        person.setX(++x);
                    }
                    break;
                case WEST:
                    if (locationService.canGoWest(person, room)) {
                        person.setX(--x);
                    }
                    break;
                case NORTH:
                    if (locationService.canGoNorth(person, room)) {
                        person.setY(--y);
                    }
                    break;
                case SOUTH:
                    if (locationService.canGoSouth(person, room)) {
                        person.setY(++y);
                    }
                    break;
                case SOUTH_WEST:
                    if (locationService.canGoSouth(person, room)) {
                        person.setY(++y);
                    }
                    if (locationService.canGoWest(person, room)) {
                        person.setX(--x);
                    }
                    break;
                case SOUTH_EAST:
                    if (locationService.canGoSouth(person, room)) {
                        person.setY(++y);
                    }
                    if (locationService.canGoEast(person, room)) {
                        person.setX(++x);
                    }
                    break;
                case NORTH_WEST:
                    if (locationService.canGoNorth(person, room)) {
                        person.setY(--y);
                    }
                    if (locationService.canGoWest(person, room)) {
                        person.setX(--x);
                    }
                    break;
                case NORTH_EAST:
                    if (locationService.canGoNorth(person, room)) {
                        person.setY(--y);
                    }
                    if (locationService.canGoEast(person, room)) {
                        person.setX(++x);
                    }
                    break;
                default:
                    //do nothing
            }
        }
    }
    
}
