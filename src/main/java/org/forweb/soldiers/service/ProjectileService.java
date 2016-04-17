package org.forweb.soldiers.service;

import org.forweb.soldiers.controller.PersonController;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.entity.ammo.Projectile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ProjectileService {

    @Autowired
    private PersonService personService;

    public synchronized void onProjectileLifecycle(ConcurrentHashMap<Integer, Projectile> projectiles) {
        Long now = System.currentTimeMillis();
        for (Map.Entry<Integer, Projectile> entry : projectiles.entrySet()) {
            Projectile projectile = entry.getValue();
            if (projectile.isInstant()) {
                if (projectile.getCreationTime() + projectile.getLifeTime() < now) {
                    projectiles.remove(entry.getKey());
                }
            } else {

            }
        }
    }

    public synchronized void calculateInstantImpacts(Person shooter, Projectile projectile, Room room) {

        float xStart = projectile.getxStart();
        float yStart = projectile.getyStart();
        
        
        for (Person person : room.getPersons().values()) {
            if (shooter == person) {
                continue;
            }

            Point linePointB = new Point((double)projectile.getxEnd(), (double)projectile.getyEnd());
            
            List<Point> intersectionPoints = getCircleLineIntersectionPoint(
                    new Point((double) xStart, (double) yStart),
                    linePointB,
                    new Point((double)person.getX(), (double)person.getY())
            );
            if (intersectionPoints != null && intersectionPoints.size() > 0) {
                person.setLife(person.getLife() - projectile.getDamage());
                if (person.getLife() <= 0) {
                    personService.kill(person, room);
                    personService.reward(person);
                }
            } else {
                System.out.println("bad");
            }
        }
    }


    private List<Point> getCircleLineIntersectionPoint(Point linePointA, Point linePointB, Point personCenter) {
        double baX = linePointB.x - linePointA.x;
        double baY = linePointB.y - linePointA.y;
        double caX = personCenter.x - linePointA.x;
        double caY = personCenter.y - linePointA.y;

        double a = baX * baX + baY * baY;
        double bBy2 = baX * caX + baY * caY;
        double c = caX * caX + caY * caY - (double) PersonController.PERSON_RADIUS * (double) PersonController.PERSON_RADIUS;

        double pBy2 = bBy2 / a;
        double q = c / a;

        double disc = pBy2 * pBy2 - q;
        if (disc < 0) {
            return null;
        }
        // if disc == 0 ... dealt with later
        double tmpSqrt = Math.sqrt(disc);
        double abScalingFactor1 = -pBy2 + tmpSqrt;
        double abScalingFactor2 = -pBy2 - tmpSqrt;

        Point p1 = new Point(linePointA.x - baX * abScalingFactor1, linePointA.y
                - baY * abScalingFactor1);
        if (disc == 0) { // abScalingFactor1 == abScalingFactor2
            return Collections.singletonList(p1);
        }
        Point p2 = new Point(linePointA.x - baX * abScalingFactor2, linePointA.y
                - baY * abScalingFactor2);
        return Arrays.asList(p1, p2);
    }

    private static class Point {
        double x, y;

        Point(double x, double y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public String toString() {
            return "Point [x=" + x + ", y=" + y + "]";
        }
    }
}
