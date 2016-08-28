package org.forweb.commandos.service.projectile;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.ammo.Explosion;
import org.forweb.commandos.service.LocationService;
import org.forweb.geometry.services.LineService;
import org.forweb.geometry.services.PointService;

public class ExplosionThread extends Thread implements Stoppable {
    private Person person;
    private Explosion explosion;
    private Room room;
    private LocationService locationService;
    private boolean stopped = false;

    public ExplosionThread(Person person, Explosion explosion, LocationService locationService, Room room) {
        this.person = person;
        this.explosion = explosion;
        this.locationService = locationService;
        this.room = room;
    }

    @Override
    public void stopExecution() {
        this.stopped = true;
    }

    @Override
    public boolean isStopped() {
        return this.stopped;
    }

    public void run() {
        person.addListener(this);
        double distancePersonExplosion = LineService.getDistance(
                person.getX(), person.getY(),
                explosion.getxStart(), explosion.getyStart()
        );
        double angle = getAngleOn(explosion.getxStart(), explosion.getyStart(), person.getX(), person.getY());
        double factor = (explosion.getRadius() - distancePersonExplosion) / explosion.getRadius();
        double xCurrent = person.getX();
        double yCurrent = person.getY();
        boolean xBlocked = false;
        boolean yBlocked = false;
        double currentShift = 1;
        double maxDistance = 150;
        double realDistance = maxDistance * factor;
        double yShift = 0;
        double xShift = 0;
        double cos = Math.cos(angle * Math.PI / 180);
        double sin = Math.sin(angle * Math.PI / 180);
        while (!stopped && !(xBlocked && yBlocked) && currentShift < realDistance) {

            if (!xBlocked) {
                double delta = cos * currentShift;
                double newPosition = delta - (person.getX() - xCurrent);
                double currentPostion = person.getX() + newPosition;
                if (
                        currentPostion <= PersonWebSocketEndpoint.PERSON_RADIUS ||
                                currentPostion >= room.getMap().getX() - PersonWebSocketEndpoint.PERSON_RADIUS ||
                                locationService.calculateCollistions(person, room, newPosition, 0) != PointService.EMPTY
                        ) {
                    xBlocked = true;
                }
                if (!xBlocked) {
                    xShift = delta;
                }
            }
            if (!yBlocked) {
                double delta = sin * currentShift;
                double newPosition = delta - (person.getY() - yCurrent);
                double currentPostion = person.getY() + newPosition;
                if (
                        currentPostion <= PersonWebSocketEndpoint.PERSON_RADIUS ||
                                currentPostion + PersonWebSocketEndpoint.PERSON_RADIUS >= room.getMap().getY() ||
                                locationService.calculateCollistions(person, room, 0, newPosition) != PointService.EMPTY
                        ) {
                    yBlocked = true;
                }
                if (!yBlocked) {
                    yShift = delta;
                }
            }
            person.setX(xCurrent + xShift);
            person.setY(yCurrent + yShift);
            currentShift++;
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    //@todo move this method to geometry library
    private static double getAngleOn(double x1, double y1, double x2, double y2) {
        boolean xEqual = x1 == x2;
        boolean yEqual = y1 == y2;
        if (xEqual && yEqual) {
            return 0;
        } else if (xEqual) {
            return y1 > y2 ? 270 : 90;
        } else if (yEqual) {
            return x1 > x2 ? 180 : 0;
        } else {
            double out = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            if (out < 0) {
                return 360 + out;
            } else {
                return out;
            }
        }
    }
}
