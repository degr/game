package org.forweb.commandos.service.person;

import org.forweb.commandos.entity.Direction;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.weapon.Minigun;
import org.forweb.commandos.entity.weapon.RocketLauncher;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.commandos.service.GeometryService;
import org.forweb.commandos.service.ItemService;
import org.forweb.commandos.service.LocationService;
import org.forweb.commandos.utils.Vector;
import org.forweb.geometry.services.CircleService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.shapes.Bounds;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Point;
import org.forweb.geometry.shapes.Rectangle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MovementService {

    private final LocationService locationService;
    private final ItemService itemService;

    private final double COS_45 = Math.cos(Math.PI / 4);
    private final double SIN_45 = Math.sin(Math.PI / 4);
    private final double D_PI = Math.PI / 2;
    private final double T_PI = Math.PI / 3;

    @Autowired
    public MovementService(ItemService itemService, LocationService locationService) {
        this.locationService = locationService;
        this.itemService = itemService;
    }


    public void onMove(Person person, Room room, double speed) {
        Direction direction = person.getDirection();
        if (direction != null) {
            if (person.getWeapon() instanceof Minigun) {
                speed *= 0.6;
            } else if (person.getWeapon() instanceof RocketLauncher) {
                speed *= 0.8;
            }
            doMove(direction, speed, person, room);
        }
    }

    private void doMove(Direction direction, double speed, Person person, Room room) {
        Vector vector = this.prepareMovementVector(direction, speed);
        Circle personCircle = person.createCircle(vector.getX(), vector.getY());
        Point[] points = this.checkCollisions(personCircle, person, room, true);
        if(points.length > 0) {
            this.shortandMove(points, personCircle, person, room, vector);
        } else {
            applyCircleCoordinates(person, personCircle);
        }
    }
    private void shortandMove(Point[] points, Circle personCircle, Person person, Room room, Vector original) {
        if(person.getAlternativeVector() != null) {
            alternativeMove(points, personCircle, person, room, original);
            return;
        }

        double scale = Math.max(Math.abs(original.getX()), Math.abs(original.getY()));
        double scaleX = original.getX() / scale;
        double scaleY = original.getY() / scale;
        Vector shortVector = new Vector(original.getX() - scaleX, original.getY() - scaleY);
        while(true) {
            if(Math.abs(shortVector.getX()) > 0.1 || Math.abs(shortVector.getY()) > 0.1) {
                Circle newPersonCircle = person.createCircle(shortVector.getX(), shortVector.getY());
                Point[] sPoints = this.checkCollisions(newPersonCircle, person, room, true);
                if(sPoints.length == 0) {
                    applyCircleCoordinates(person, newPersonCircle);
                    person.setAlternativeVector(null);
                    break;
                }
            } else {
                alternativeMove(points, personCircle, person, room, original);
                break;
            }
            shortVector = new Vector(shortVector.getX() - scaleX, shortVector.getY() - scaleY);
        }
    }

    private void alternativeMove(Point[] points, Circle personCircle, Person person, Room room, Vector original) {

        Vector alternativeVector = person.getAlternativeVector();
        if(alternativeVector == null) {
            alternativeVector = findAlternative(points, personCircle, original);
        }
        if(alternativeVector != null && Math.abs(original.computeAngle(alternativeVector)) < T_PI) {
            person.setAlternativeVector(alternativeVector);
            Vector[] atomicVector = divideVector(alternativeVector);
            for(Vector vector : atomicVector) {
                Circle c = person.createCircle(vector.getX(), vector.getY());
                Point[] p = this.checkCollisions(c, person, room, true);
                if(p == PointService.EMPTY) {
                    person.setX(c.getX());
                    person.setY(c.getY());
                    Circle originalCircle = person.createCircle(original.getX(), original.getY());
                    Point[] originalPoint = this.checkCollisions(originalCircle, person, room, false);
                    if(originalPoint == PointService.EMPTY) {
                        break;
                    }
                } else {
                    person.setAlternativeVector(null);
                    break;
                }
            }
        }
    }

    private Vector findAlternative(Point[] points, Circle personCircle, Vector original) {
        if(points.length == 2) {
            return processTwoVectors(
                    new Vector(points[0].getX() - points[1].getX(), points[0].getY() - points[1].getY()),
                    new Vector(points[1].getX() - points[0].getX(), points[1].getY() - points[0].getY()),
                    original
            );
        } else if(points.length == 1) {
            double angle = Math.atan2(personCircle.getY() - points[0].getY(), personCircle.getX() - points[0].getX());
            return processTwoVectors(
                    new Vector(Math.cos(angle + D_PI), Math.sin(angle + D_PI)),
                    new Vector(Math.cos(angle - D_PI), Math.sin(angle - D_PI)),
                    original
            );
        } else {
            return null;
        }
    }

    private Vector processTwoVectors(Vector vector1, Vector vector2, Vector original) {
        double abs1 = Math.abs(original.computeAngle(vector1));
        double abs2 = Math.abs(original.computeAngle(vector2));
        if(abs1 > abs2) {
            return setCandidateLength(vector2, original);
        } else if(abs2 > abs1){
            return setCandidateLength(vector1, original);
        } else {
            return null;
        }
    }


    public Vector setCandidateLength(Vector candidate, Vector original) {
        if(candidate.equals(original)) {
            return candidate;
        } else {
            double originalLength = original.computeLength();
            double angle = candidate.computeAngle();
            return new Vector(
                    Math.cos(angle) * originalLength,
                    Math.sin(angle) * originalLength
            );
        }
    }


    private Vector[] divideVector(Vector alternativeVector) {
        double x = alternativeVector.getX();
        double y = alternativeVector.getY();
        int length = (int) StrictMath.sqrt(x * x + y * y);
        Vector atomic = new Vector(x / length, y / length);
        Vector[] out = new Vector[length];
        while(length > 0) {
            length--;
            out[length] = atomic;
        }
        return out;
    }

    private void applyCircleCoordinates(Person person, Circle personCircle) {
        person.setX(personCircle.getX());
        person.setY(personCircle.getY());
    }

    private Point[] checkCollisions(Circle personCircle, Person person, Room room, boolean canCollect) {

        Set<AbstractZone> set = new HashSet<>();
        List<Interactive> itemsToPick = null;
        Bounds bounds = room.getBounds();
        Point[] point = CircleService.circleBoundsIntersection(personCircle, bounds);
        if(point.length > 0) {
            return point;
        }

        for(List<AbstractZone> zones : room.getClusterZonesFor((int) personCircle.getX(), (int)personCircle.getY())) {
            for (AbstractZone zone : zones) {
                if(set.contains(zone)) {
                    continue;
                } else {
                    set.add(zone);
                }
                Rectangle rectangle = zone.getRectangle();
                point = GeometryService.circleIntersectRectangle(personCircle, rectangle);

                if (point != PointService.EMPTY) {
                    if (zone.isPassable()) {
                        if (zone instanceof Interactive) {
                            if (itemsToPick == null) {
                                itemsToPick = new ArrayList<>();
                            }
                            itemsToPick.add((Interactive) zone);
                        }
                    } else {
                        return point;
                    }
                }
            }
        }
        if (canCollect && itemsToPick != null) {
            for (Interactive item : itemsToPick) {
                itemService.onGetItem(item, person, room);
                if(item.isTemporary()) {
                    List<AbstractZone> zones = room.getMap().getZones();
                    AbstractZone zone = (AbstractZone)item;
                    List<List<AbstractZone>> clusteredZones = room.getClusterZonesFor(zone.getX() + zone.getWidth() / 2, zone.getY() + zone.getHeight() / 2);

                    for (List<AbstractZone> zones1 : clusteredZones) {
                        for (int j = zones1.size(); j > 0; j--) {
                            if (zones1.get(j - 1) == item) {
                                zones1.remove(j - 1);
                            }
                        }
                    }
                    int length = zones.size();
                    for(int i = length - 1; i >= 0; i--) {
                        if(zones.get(i) == item) {
                            zones.remove(i);
                            break;
                        }
                    }
                }
            }
        }
        person.setX(personCircle.getX());
        person.setY(personCircle.getY());
        return PointService.EMPTY;
    }

    private Vector prepareMovementVector(Direction direction, double speed) {
        switch (direction) {
            case EAST:
                return new Vector(speed, 0);
            case WEST:
                return new Vector(-speed, 0);
            case NORTH:
                return new Vector(0, -speed);
            case SOUTH:
                return new Vector(0, speed);
            case SOUTH_EAST:
                return new Vector(COS_45 * speed, SIN_45 * speed);
            case NORTH_EAST:
                return new Vector(COS_45 * speed, SIN_45 * -speed);
            case SOUTH_WEST:
                return new Vector(COS_45 * -speed, SIN_45 * speed);
            case NORTH_WEST:
                return new Vector(COS_45 * -speed, SIN_45 * -speed);
            default:
                return new Vector(0, 0);
        }
    }
}
