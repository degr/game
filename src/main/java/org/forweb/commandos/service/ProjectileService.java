package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.ammo.*;
import org.forweb.commandos.entity.weapon.*;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.game.Context;
import org.forweb.geometry.services.LineService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Line;
import org.forweb.geometry.shapes.Point;
import org.forweb.geometry.shapes.Bounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
class ProjectileService {

    @Autowired
    Context gameContext;

    @Autowired
    private PersonService personService;

    private Random random = new Random();

    synchronized void onProjectileLifecycle(ConcurrentHashMap<Integer, Projectile> projectiles) {
        Long now = System.currentTimeMillis();
        for (Map.Entry<Integer, Projectile> entry : projectiles.entrySet()) {
            Projectile projectile = entry.getValue();
            projectile.setNow(System.currentTimeMillis());
            if (projectile.getCreationTime() + projectile.getLifeTime() < now) {
                projectiles.remove(entry.getKey());
            }
        }
    }

    private synchronized void calculateInstantImpacts(Person shooter, Projectile projectile, Room room) {

        float xStart = projectile.getxStart();
        float yStart = projectile.getyStart();

        Person closestPerson = null;
        Point closestPoint = null;


        for (AbstractZone zone : room.getMap().getZones()) {
            if (zone.isShootable()) {
                continue;
            }
            Bounds zoneBounds = GeometryService.getRectangle(zone);
            Point[] zoneIntersection = LineService.lineBoundsIntersections(
                    new Line(
                            new Point(shooter.getX(), shooter.getY()),
                            new Point(projectile.getxEnd(), projectile.getyEnd())
                    ),
                    zoneBounds
            );
            Point closest = isMoreClose(
                    projectile.getxStart(),
                    projectile.getyStart(),
                    new Point(projectile.getxEnd(), projectile.getyEnd()),
                    zoneIntersection
            );
            if (closest != null) {
                closestPoint = closest;
                projectile.setxEnd((int) closest.getX());
                projectile.setyEnd((int) closest.getY());
            }
        }

        for (Person person : room.getPersons().values()) {
            if (shooter == person) {
                continue;
            }

            Point linePointB = new Point((double) projectile.getxEnd(), (double) projectile.getyEnd());
            Point[] intersectionPoints = LineService.lineIntersectCircle(
                    new Line(
                            new Point((double) xStart, (double) yStart),
                            linePointB
                    ),
                    new Circle(person.getX(), person.getY(), PersonWebSocketEndpoint.PERSON_RADIUS)
            );
            if (intersectionPoints != null && intersectionPoints.length > 0) {
                Point closest = isMoreClose(shooter.getX(), shooter.getY(), closestPoint, intersectionPoints);
                if(closest != null) {
                    if (projectile.isPiercing()) {
                        onDamage(shooter, projectile, person, room);
                    } else {
                        closestPoint = closest;
                        closestPerson = person;
                    }
                }
            }
        }


        if (closestPerson != null) {
            onDamage(shooter, projectile, closestPerson, room);
        }
        if (closestPoint != null) {
            projectile.setxEnd((int) closestPoint.getX());
            projectile.setyEnd((int) closestPoint.getY());
        }
    }

    private void onDamage(Person shooter, Projectile projectile, Person person, Room room) {
        person.setLife(person.getLife() - projectile.getDamage());
        if (person.getLife() <= 0) {
            personService.kill(person, room);
            personService.reward(shooter);
        }
    }

    private Point isMoreClose(int x, int y, Point closestPoint, Point[] intersectionPoints) {
        double clothestDistance = closestPoint != null ?
                Math.sqrt(Math.pow(x - closestPoint.getX(), 2) + Math.pow(y - closestPoint.getY(), 2)) :
                -1;
        Point selectedPoint = null;
        for (Point point : intersectionPoints) {
            if (point == null) {
                continue;
            }
            double distance = Math.sqrt(Math.pow(x - point.getX(), 2) + Math.pow(y - point.getY(), 2));
            if (distance < clothestDistance || clothestDistance == -1) {
                clothestDistance = distance;
                selectedPoint = point;
            }
        }
        return selectedPoint;
    }



    void doShot(Person person, String status) {
        boolean isFire = "1".equals(status);
        person.setIsFire(isFire);
        handleFire(person);
    }

    void handleFire(Person person) {
        if (person.isFire()) {
            long now = System.currentTimeMillis();
            if(person.getWeapon().getCurrentClip() <= 0 && !person.isReload()) {
                person.setIsReload(true);
                person.setReloadCooldown(person.getWeapon().getReloadTimeout());
            } else if (person.getShotCooldown() < now && person.getReloadCooldown() < now ) {
                if(person.isReload()) {
                    person.setIsReload(false);
                }
                fire(person, gameContext.getRoom(0));
            }
        }
    }

    private void fire(Person person, Room room) {
        AbstractWeapon gun = person.getWeapon();
        person.setShotCooldown(System.currentTimeMillis() + gun.getShotTimeout());
        gun.setCurrentClip(gun.getCurrentClip() - 1);

        for(int i = 0; i < gun.getBulletsPerShot(); i++) {
            Projectile projectile = getCompatibleProjectile(person);
            Integer id = gameContext.getProjectilesIds().getAndIncrement();
            room.getProjectiles().put(id, projectile);

            float angle = projectile.getAngle();
            if (angle == 90) {
                projectile.setxEnd(person.getX());
                int gunLimit = (int) gun.getRadius() + person.getY();
                projectile.setyEnd(gunLimit > room.getMap().getY() ? room.getMap().getY() : gunLimit);
            } else if (angle == 180) {
                projectile.setyEnd(person.getY());
                int gunLimit = person.getX() - (int) gun.getRadius();
                projectile.setyEnd(gunLimit > 0 ? gunLimit : 0);
            } else if (angle == 270) {
                projectile.setxEnd(person.getX());
                int gunLimit = person.getY() - (int) gun.getRadius();
                projectile.setyEnd(gunLimit > 0 ? gunLimit : 0);
            } else if (angle == 0) {
                projectile.setyEnd(person.getY());
                int gunLimit = person.getX() + (int) gun.getRadius();
                projectile.setyEnd(gunLimit > room.getMap().getX() ? room.getMap().getX() : gunLimit);
            } else {
                double y = gun.getRadius() * Math.sin(angle * Math.PI / 180);
                double x = gun.getRadius() * Math.cos(angle * Math.PI / 180);
                projectile.setxEnd((int) x + person.getX());
                projectile.setyEnd((int) y + person.getY());
            }
            if (projectile.isInstant()) {
                calculateInstantImpacts(person, projectile, room);
            }
        }
    }

    private Projectile getCompatibleProjectile(Person person) {
        float angle = getNewProjectileAngle(person);
        if(person.getWeapon() instanceof Knife) {
            return new KnifeAmmo(person.getX(), person.getY(), angle);
        } else if(person.getWeapon() instanceof Pistol || person.getWeapon() instanceof AssaultRifle || person.getWeapon() instanceof Minigun) {
            return new Bullet(person.getX(), person.getY(), angle);
        } else if(person.getWeapon() instanceof SniperRifle) {
            return new SniperBullet(person.getX(), person.getY(), angle);
        } else if(person.getWeapon() instanceof RocketLauncher) {
            return new Rocket(person.getX(), person.getY(), angle);
        }else if(person.getWeapon() instanceof Flamethrower) {
            return new Flame(person.getX(), person.getY(), angle);
        } else {
            throw new RuntimeException("Person have no weapon!");
        }

    }


    private float getNewProjectileAngle(Person person) {
        float spread = (float) person.getWeapon().getSpread();
        return person.getAngle() + random.nextFloat() * (spread * 2) - spread;
    }


}

