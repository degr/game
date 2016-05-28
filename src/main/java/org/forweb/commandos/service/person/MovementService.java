package org.forweb.commandos.service.person;

import org.forweb.commandos.entity.Direction;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.weapon.Minigun;
import org.forweb.commandos.service.LocationService;
import org.forweb.geometry.shapes.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovementService {

    @Autowired
    LocationService locationService;


    public void onMove(Person person, Room room){

        Direction direction = person.getDirection();
        double x = person.getX();
        double y = person.getY();
        double factor = 1;
        if(person.getWeapon() instanceof Minigun) {
            factor *= 0.6;
        }
        if (direction != null) {
            switch (direction) {
                case EAST:
                    onGoEast(person, room, x, y, factor);
                    break;
                case WEST:
                    onGoWest(person, room, x, y, factor);
                    break;
                case NORTH:
                    onGoNorth(person, room, x, y, factor);
                    break;
                case SOUTH:
                    onGoSouth(person, room, x, y, factor);
                    break;
                case SOUTH_WEST:
                    onGoSouth(person, room, x, y, factor);
                    onGoWest(person, room, x, y, factor);
                    break;
                case SOUTH_EAST:
                    onGoSouth(person, room, x, y, factor);
                    onGoEast(person, room, x, y, factor);
                    break;
                case NORTH_WEST:
                    onGoNorth(person, room, x, y, factor);
                    onGoWest(person, room, x, y, factor);
                    break;
                case NORTH_EAST:
                    onGoNorth(person, room, x, y, factor);
                    onGoEast(person, room, x, y, factor);
                    break;
                default:
                    //do nothing
            }
        }
    }

    private void onGoEast(Person person, Room room, double x, double y, double factor) {
        Point[] point = locationService.canGoEast(person, room);
        if (point != null) {
            if(point.length == 0) {
                person.setX(x + factor);
            } else {
                onFloatOx(point, y, person, room, factor);
            }
        }
    }
    private void onGoWest(Person person, Room room, double x, double y, double factor) {
        Point[] point = locationService.canGoWest(person, room);
        if (point != null) {
            if(point.length == 0) {
                person.setX(x - factor);
            } else {
                onFloatOx(point, y, person, room, factor);
            }
        }
    }
    private void onGoSouth(Person person, Room room, double x, double y, double factor) {
        Point[] point = locationService.canGoSouth(person, room);
        if (point != null) {
            if(point.length == 0) {
                person.setY(y + factor);
            } else {
                onFloatOy(point, x, person, room, factor);
            }
        }
    }
    private void onGoNorth(Person person, Room room, double x, double y, double factor) {
        Point[] point = locationService.canGoNorth(person, room);
        if (point != null) {
            if(point.length == 0) {
                person.setY(y - factor);
            } else {
                onFloatOy(point, x, person, room, factor);
            }
        }
    }

    private void onFloatOx(Point[] point, double y, Person person, Room room, double factor) {
        if(Math.abs(point[0].getY() - person.getY()) > 0.5) {
            if (point[0].getY() > y) {
                Point[] northPoint = locationService.canGoNorth(person, room);
                if (northPoint != null && northPoint.length == 0) {
                    person.setY(y - factor);
                }
            } else if (point[0].getY() < y) {
                Point[] southPoint = locationService.canGoSouth(person, room);
                if (southPoint != null && southPoint.length == 0) {
                    person.setY(y + factor);
                }
            }
        }
    }

    private void onFloatOy(Point[] point, double x, Person person, Room room, double factor) {
        if(Math.abs(point[0].getX() - person.getX()) > 0.5) {
            if (point[0].getX() > x) {
                Point[] westPoint = locationService.canGoWest(person, room);
                if (westPoint != null && westPoint.length == 0) {
                    person.setX(x - factor);
                }
            } else if (point[0].getX() < x) {
                Point[] eastPoint = locationService.canGoEast(person, room);
                if (eastPoint != null && eastPoint.length == 0) {
                    person.setX(x + factor);
                }
            }
        }
    }
}
