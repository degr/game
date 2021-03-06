package org.forweb.commandos.service.person;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Direction;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.weapon.Minigun;
import org.forweb.commandos.entity.weapon.RocketLauncher;
import org.forweb.commandos.service.LocationService;
import org.forweb.geometry.shapes.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static org.forweb.commandos.controller.PersonWebSocketEndpoint.MOVEMENT_SPEED;

@Service
public class MovementService {

    @Autowired
    LocationService locationService;


    public void onMove(Person person, Room room, double speed){

        Direction direction = person.getDirection();
        double initialSpeed = speed;
        if(person.getWeapon() instanceof Minigun) {
            speed *= 0.6;
        } else if(person.getWeapon() instanceof RocketLauncher) {
            speed *= 0.8;
        }
        if (direction != null) {
            switch (direction) {
                case SOUTH_WEST:
                case SOUTH_EAST:
                case NORTH_WEST:
                case NORTH_EAST:
                    speed = speed * speed / Math.sqrt(Math.pow(speed, 2) * 2);
                    break;
            }
            int onOx;
            switch (direction) {
                case EAST:
                    onGoEast(person, room, speed, true);
                    break;
                case WEST:
                    onGoWest(person, room, speed, true);
                    break;
                case NORTH:
                    onGoNorth(person, room, speed, 0);
                    break;
                case SOUTH:
                    onGoSouth(person, room, speed, 0);
                    break;
                case SOUTH_WEST:
                    onOx = onGoSouth(person, room, speed, -1);
                    if(onOx == 0) {
                        onGoWest(person, room, speed, false);
                    }
                    break;
                case SOUTH_EAST:
                    onOx = onGoSouth(person, room, speed, 1);
                    if(onOx == 0) {
                        onGoEast(person, room, speed, false);
                    }
                    break;
                case NORTH_WEST:
                    onOx = onGoNorth(person, room, speed, -1);
                    if(onOx == 0) {
                        onGoWest(person, room, speed, false);
                    }
                    break;
                case NORTH_EAST:
                    onOx = onGoNorth(person, room, speed, 1);
                    if(onOx == 0) {
                        onGoEast(person, room, speed, false);
                    }
                    break;
                default:
                    //do nothing
            }
        }
    }

    private void onGoEast(Person person, Room room, double speed, boolean allowFloat) {
        Point[] point = locationService.canGoEast(person, room, speed);
        if (point != null) {
            if(point.length == 0) {
                person.setX(person.getX() + speed);
            } else if(allowFloat){
                if(!onFloatOx(point, person, room, speed, true)) {
                    if(speed == MOVEMENT_SPEED) {
                        onGoEast(person, room, MOVEMENT_SPEED / 2, true);
                    } else if(speed == MOVEMENT_SPEED / 4) {
                        onGoEast(person, room, MOVEMENT_SPEED / 4, true);
                    }
                }
            }
        }
    }
    private void onGoWest(Person person, Room room, double speed, boolean allowFloat) {
        Point[] point = locationService.canGoWest(person, room, speed);
        if (point != null) {
            if(point.length == 0) {
                person.setX(person.getX() - speed);
            } else  if(allowFloat){
                if(!onFloatOx(point, person, room, speed, true)) {
                    if(speed == MOVEMENT_SPEED) {
                        onGoWest(person, room, MOVEMENT_SPEED / 2, true);
                    } else if(speed == MOVEMENT_SPEED / 4) {
                        onGoWest(person, room, MOVEMENT_SPEED / 4, true);
                    }
                }
            }
        }
    }
    private int onGoSouth(Person person, Room room, double distance, int oxShift) {
        Point[] point = locationService.canGoSouth(person, room, distance);
        if (point != null) {
            if(point.length == 0) {
                person.setY(person.getY() + distance);
                return 0;
            } else {
                return onFloatOy(point, person, room, distance, true, oxShift);
            }
        } else {
            return 0;
        }
    }
    private int onGoNorth(Person person, Room room, double distance, int oxShift) {
        Point[] point = locationService.canGoNorth(person, room, distance);
        if (point != null) {
            if(point.length == 0) {
                person.setY(person.getY() - distance);
                return 0;
            } else {
                return onFloatOy(point, person, room, distance, false, oxShift);
            }
        } else {
            return 0;
        }
    }

    private boolean onFloatOx(Point[] point, Person person, Room room, double distance, boolean onGoEast) {
        double y = person.getY();
        Point floatPoint;
        if(point.length == 1) {
            floatPoint = point[0];
        } else {
            floatPoint = new Point(point[0].getX(), (point[0].getY() + point[1].getY()) / 2);
        }
        if(Math.abs(floatPoint.getY() - person.getY()) > 0.5) {
            if (floatPoint.getY() > y) {
                Point[] northPoint = locationService.canGoNorth(person, room, distance);
                if (northPoint != null && northPoint.length == 0) {
                    person.setY(y - distance);
                    return true;
                } else {
                    return false;
                }
            } else if (floatPoint.getY() < y) {
                Point[] southPoint = locationService.canGoSouth(person, room, distance);
                if (southPoint != null && southPoint.length == 0) {
                    person.setY(y + distance);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private int onFloatOy(Point[] point, Person person, Room room, double distance, boolean onGoSouth, int oxShift) {
        double x = person.getX();
        Point floatPoint;
        if(point.length == 1) {
            floatPoint = point[0];
        } else {
            floatPoint = new Point((point[0].getX() + point[1].getX()) / 2, point[0].getY());
        }
        if(Math.abs(floatPoint.getX() - person.getX()) > 0.5) {
            if (floatPoint.getX() > x) {
                if(oxShift != 1) {
                    Point[] westPoint = locationService.canGoWest(person, room, distance);
                    if (westPoint != null && westPoint.length == 0) {
                        person.setX(x - distance);
                    }
                    return 1;
                }
            } else if (floatPoint.getX() < x) {
                if(oxShift != -1) {
                    Point[] eastPoint = locationService.canGoEast(person, room, distance);
                    if (eastPoint != null && eastPoint.length == 0) {
                        person.setX(x + distance);
                    }
                    return -1;
                }
            }
        }
        return 0;
    }
}
