package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.ammo.*;
import org.forweb.commandos.entity.weapon.*;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.game.Context;
import org.forweb.geometry.services.CircleService;
import org.forweb.geometry.services.LineService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Line;
import org.forweb.geometry.shapes.Point;
import org.forweb.geometry.shapes.Bounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ProjectileService {

    @Autowired
    Context gameContext;

    @Autowired
    private PersonService personService;

    private static final Random random = new Random();

    synchronized void onProjectileLifecycle(ConcurrentHashMap<Integer, Projectile> projectiles, Room room) {
        Long now = System.currentTimeMillis();
        for (Map.Entry<Integer, Projectile> entry : projectiles.entrySet()) {
            Projectile projectile = entry.getValue();
            projectile.setNow(System.currentTimeMillis());
            if (projectile.getCreationTime() + projectile.getLifeTime() < now) {
                projectiles.remove(entry.getKey());
                continue;
            }
            if (!projectile.isInstant()) {
                checkForImpacts(room, projectile, entry.getKey());
            }
        }
    }

    private void checkForImpacts(Room room, Projectile projectile, Integer batchId) {
        if(projectile instanceof Flame) {
            onFlameLifecycle(room, (Flame)projectile, batchId);
        } else if (projectile instanceof Rocket) {
            onRocketLifecycle(room, (Rocket) projectile, batchId);
        }

    }

    private void onFlameLifecycle(Room room, Flame flame, Integer flameBathcId) {
        if(!flame.isStoped()) {
            updatePosition(flame);
        }

        if(!flame.isStoped()) {
            if (flame.getxStart() <= 0 || flame.getxStart() >= room.getMap().getX() ||
                    flame.getyStart() <= 0 || flame.getyStart() >= room.getMap().getY()) {
                flame.setStoped(true);
            }
        }
        Circle flameCircle = new Circle(flame.getxStart(), flame.getyStart(), PersonWebSocketEndpoint.FIRE_RADIUS);
        if(!flame.isStoped()) {
            for (AbstractZone zone : room.getMap().getZones()) {
                if (!zone.isShootable()) {
                    Point[] point = CircleService.circleBoundsIntersection(
                            flameCircle,
                            new Bounds(zone.getX(), zone.getY(), zone.getWidth(), zone.getHeight())
                    );
                    if (point.length > 0) {
                        flame.setStoped(true);
                        break;
                    }
                }
            }
        }
        for(Person person : room.getPersons().values()) {
            if(person.getId() != flame.getPersonId()) {
                Circle personCircle = new Circle(
                        person.getX(),
                        person.getY(),
                        PersonWebSocketEndpoint.PERSON_RADIUS
                );
                Point[] point = CircleService.circleCircleIntersection(
                        flameCircle,
                        personCircle
                );
                if(point.length > 0) {
                    onDamage(room.getPersons().get(flame.getPersonId()), flame.getDamage(), person, room);
                    room.getProjectiles().remove(flameBathcId);
                }
            }

        }

    }

    private void onRocketLifecycle(Room room, Rocket rocket, Integer rocketBatchId) {
        updatePosition(rocket);

        Circle rocketCircle = new Circle(
                rocket.getxStart(),
                rocket.getyStart(),
                PersonWebSocketEndpoint.ROCKET_RADIUS
        );
        Explosion explosion = null;
        if(rocket.getxStart() <= 0 || rocket.getxStart() >= room.getMap().getX() ||
                rocket.getyStart() <= 0 || rocket.getyStart() >= room.getMap().getY()) {
            explosion = new Explosion((int)rocket.getxStart(), (int)rocket.getyStart());
        }
        if(explosion == null) {
            for (AbstractZone zone : room.getMap().getZones()) {
                if (!zone.isShootable()) {
                    Point[] point = CircleService.circleBoundsIntersection(
                            rocketCircle,
                            new Bounds(zone.getX(), zone.getY(), zone.getWidth(), zone.getHeight())
                    );
                    if (point.length > 0) {
                        explosion = new Explosion((int) point[0].getX(), (int) point[0].getY());
                        break;
                    }
                }
            }
        }
        if(explosion == null) {
            for(Person person : room.getPersons().values()) {
                if(person.getId() != rocket.getPersonId()) {
                    Circle personCircle = new Circle(
                            person.getX(),
                            person.getY(),
                            PersonWebSocketEndpoint.PERSON_RADIUS
                    );
                    Point[] point = CircleService.circleCircleIntersection(
                            rocketCircle,
                            personCircle
                    );
                    if(point.length > 0) {
                        explosion = new Explosion((int)point[0].getX(), (int) point[0].getY());
                        onDamage(room.getPersons().get(rocket.getPersonId()), rocket.getDamage(), person, room);
                        break;
                    }
                }
            }
        }

        if(explosion != null) {
            explosion.setxEnd((int)explosion.getxStart());
            explosion.setyEnd((int)explosion.getyStart());
            int id = gameContext.getProjectilesIds().getAndIncrement();
            room.getProjectiles().put(id, explosion);

            Circle explosionCircle = new Circle(
                    explosion.getxStart(),
                    explosion.getyStart(),
                    explosion.getRadius()
            );
            Person shooter = room.getPersons().get(rocket.getPersonId());

            for(Person person : room.getPersons().values()) {
                double damageFactor = PointService.pointBelongToCircle(
                        new Point(person.getX(), person.getY()),
                        explosionCircle
                );
                if (damageFactor > -1) {
                    double damage = explosion.getDamage() + damageFactor * explosion.getDamageFactor();
                    onDamage(shooter, (int)damage, person, room);
                }
            }
            room.getProjectiles().remove(rocketBatchId);
        }
    }

    private void updatePosition(Projectile projectile) {
        double distance = projectile.getRadius() * Context.TICK_DELAY / projectile.getLifeTime();
        double angle = projectile.getAngle() * Math.PI / 180;
        double y = distance * Math.sin(angle);
        double x = distance * Math.cos(angle);
        projectile.setxStart(projectile.getxStart() + x);
        projectile.setyStart(projectile.getyStart() + y);
    }

    private synchronized void calculateInstantImpacts(Person shooter, Projectile projectile, Room room) {

        double xStart = projectile.getxStart();
        double yStart = projectile.getyStart();

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
                    (int)projectile.getxStart(),
                    (int)projectile.getyStart(),
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
            Point linePointB = new Point((double) projectile.getxEnd(), (double) projectile.getyEnd());
            Point[] intersectionPoints = LineService.lineIntersectCircle(
                    new Line(
                            new Point(xStart, yStart),
                            linePointB
                    ),
                    new Circle(person.getX(), person.getY(), PersonWebSocketEndpoint.PERSON_RADIUS)
            );

            if (shooter == person) {
                if(intersectionPoints.length > 0) {
                    projectile.setxStart((int) intersectionPoints[0].getX());
                    projectile.setyStart((int) intersectionPoints[0].getY());
                }
                continue;
            }


            if (intersectionPoints != null && intersectionPoints.length > 0) {
                Point closest = isMoreClose((int)shooter.getX(), (int)shooter.getY(), closestPoint, intersectionPoints);
                if(closest != null) {
                    if (projectile.isPiercing()) {
                        onDamage(shooter, projectile.getDamage(), person, room);
                    } else {
                        closestPoint = closest;
                        closestPerson = person;
                    }
                }
            }
        }


        if (closestPerson != null) {
            onDamage(shooter, projectile.getDamage(), closestPerson, room);
        }
        if (closestPoint != null) {
            projectile.setxEnd((int) closestPoint.getX());
            projectile.setyEnd((int) closestPoint.getY());
        }
    }

    private void onDamage(Person shooter, int damage, Person person, Room room) {
        int life = person.getLife();
        int armor = person.getArmor();
        if(armor > 0) {
            int armorDamage = damage * 2 / 3;
            person.setArmor(armor - armorDamage);
            damage = damage - armorDamage;
            if(person.getArmor() < 0) {
                damage -= person.getArmor();
                person.setArmor(0);
            }

        }
        person.setLife(life - damage);

        if (person.getLife() <= 0) {
            personService.kill(person, room);
            personService.reward(shooter, person);
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



    void doShot(Person person, String status, Room room) {
        boolean isFire = "1".equals(status);
        person.setIsFire(isFire);
        handleFire(person, room);
    }

    void handleFire(Person person, Room room) {
        if (person.isFire()) {
            AbstractWeapon weapon = person.getWeapon();
            long now = System.currentTimeMillis();
            if(!person.isReload() && weapon.getCurrentClip() <= 0) {
                if(person.isNoPassiveReload()) {
                    if(person.getShotCooldown() < now) {
                        AbstractWeapon newWeapon = findBestWeapon(person.getWeaponList());
                        if (newWeapon != null) {
                            person.setWeapon(newWeapon);
                            fire(person, room);
                        }
                    }
                } else {
                    doReload(person, now);
                }
            } else if (!person.isReload() && weapon.getCurrentClip() > 0 && person.getShotCooldown() < now) {
                fire(person, room);
            }
        }
    }

    private AbstractWeapon findBestWeapon(List<AbstractWeapon> weaponList) {
        int index = -1;
        int weight = -1;
        for(int i = 0; i < weaponList.size(); i++) {
            AbstractWeapon weapon = weaponList.get(i);
            if(weapon.getCurrentClip() > 0) {
                if (weapon instanceof Pistol) {
                    if (weight < 1) {
                        weight = 1;
                        index = i;
                    }
                } else if(weapon instanceof Shotgun ) {
                    if (weight < 2) {
                        weight = 2;
                        index = i;
                    }
                } else if(weapon instanceof AssaultRifle) {
                    if (weight < 3) {
                        weight = 3;
                        index = i;
                    }
                } else if(weapon instanceof SniperRifle) {
                    if (weight < 4) {
                        weight = 4;
                        index = i;
                    }
                } else if(weapon instanceof Flamethrower) {
                    if (weight < 5) {
                        weight = 5;
                        index = i;
                    }
                } else if(weapon instanceof Minigun) {
                    if (weight < 6) {
                        weight = 6;
                        index = i;
                    }
                }
            }
        }
        return index > -1 ? weaponList.get(index) : null;
    }

    public void doReload(Person person, long now) {
        if(person.getWeapon().getTotalClip() > 0) {
            person.setIsReload(true);
            person.setReloadCooldown(now + person.getWeapon().getReloadTimeout());
        }
    }

    public void onReload(Person person, long now) {
        if(person.isReload() && person.getShotCooldown() < now && person.getReloadCooldown() < now ) {
            AbstractWeapon weapon = person.getWeapon();
            if(weapon.getTotalClip() <= 0) {
                return;
            }
            person.setIsReload(false);
            int clipToReload = weapon.getClipSize();
            if(clipToReload > weapon.getTotalClip()) {
                clipToReload = weapon.getTotalClip();
            }
            weapon.setCurrentClip(clipToReload);
        }
    }

    private void fire(Person person, Room room) {
        AbstractWeapon gun = person.getWeapon();
        person.setShotCooldown(System.currentTimeMillis() + gun.getShotTimeout());

        gun.setTotalClip(gun.getTotalClip() - 1);
        gun.setCurrentClip(gun.getCurrentClip() - 1);

        Projectile projectile = getCompatibleProjectile(person);
        Integer id = gameContext.getProjectilesIds().getAndIncrement();
        projectile.setId(id);
        if(projectile instanceof Shot) {
            Shot shotProjectile = (Shot) projectile;
            for(SubShot subShot : shotProjectile.getSubShots()) {
                Integer subId = gameContext.getProjectilesIds().getAndIncrement();
                subShot.setId(subId);
                onProjectileInstantiation(person, subShot, room);
            }
        } else {
            onProjectileInstantiation(person, projectile, room);
        }
        room.getProjectiles().put(id, projectile);
    }

    private void onProjectileInstantiation(Person person, Projectile projectile, Room room) {
        float angle = projectile.getAngle();
        if (angle == 90) {
            projectile.setxEnd((int)person.getX());
            int gunLimit = (int) (projectile.getRadius() + person.getY());
            projectile.setyEnd(gunLimit > room.getMap().getY() ? room.getMap().getY() : gunLimit);
        } else if (angle == 180) {
            projectile.setyEnd((int)person.getY());
            int gunLimit = (int)person.getX() - (int) projectile.getRadius();
            projectile.setyEnd(gunLimit > 0 ? gunLimit : 0);
        } else if (angle == 270) {
            projectile.setxEnd((int)person.getX());
            int gunLimit = (int)person.getY() - (int) projectile.getRadius();
            projectile.setyEnd(gunLimit > 0 ? gunLimit : 0);
        } else if (angle == 0) {
            projectile.setyEnd((int)person.getY());
            int gunLimit = (int)person.getX() + (int) projectile.getRadius();
            projectile.setyEnd(gunLimit > room.getMap().getX() ? room.getMap().getX() : gunLimit);
        } else {
            double y = projectile.getRadius() * Math.sin(angle * Math.PI / 180);
            double x = projectile.getRadius() * Math.cos(angle * Math.PI / 180);
            projectile.setxEnd((int) x + (int)person.getX());
            projectile.setyEnd((int) y + (int)person.getY());
        }
        if (projectile.isInstant()) {
            calculateInstantImpacts(person, projectile, room);
        }
    }

    public static float changeProjectileAngle(Person person) {
        float spread = person.getWeapon().getSpread();
        return person.getAngle() + random.nextFloat() * (spread * 2) - spread;
    }

    private Projectile getCompatibleProjectile(Person person) {
        return person.getWeapon().getProjectile(person, changeProjectileAngle(person));
    }




    public void changeWeapon(Person person, Integer weaponCode) {
        if(person.isReload()) {
            return;
        }
        String weaponTitle = "";
        switch (weaponCode) {
            case 1:
                weaponTitle = "knife";
                break;
            case 2:
                weaponTitle = "pistol";
                break;
            case 3:
                weaponTitle = "shotgun";
                break;
            case 4:
                weaponTitle = "assault";
                break;
            case 5:
                weaponTitle = "sniper";
                break;
            case 6:
                weaponTitle = "flamethrower";
                break;
            case 7:
                weaponTitle = "minigun";
                break;
            case 8:
                weaponTitle = "rocket";
                break;
        }
        if(!"".equals(weaponTitle)) {
            for(AbstractWeapon weapon : person.getWeaponList()) {
                if(weapon.getName().equals(weaponTitle)) {
                    person.setWeapon(weapon);
                    break;
                }
            }
        }
    }
}

