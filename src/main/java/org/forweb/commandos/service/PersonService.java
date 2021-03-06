package org.forweb.commandos.service;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Direction;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.weapon.*;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.interactive.FlagBlueTemp;
import org.forweb.commandos.entity.zone.interactive.FlagRedTemp;
import org.forweb.commandos.entity.zone.interactive.Respawn;
import org.forweb.commandos.entity.zone.items.*;
import org.forweb.commandos.game.Context;
import org.forweb.commandos.response.Status;
import org.forweb.commandos.service.person.MovementService;
import org.forweb.commandos.service.person.TurnService;
import org.forweb.commandos.service.projectile.Stoppable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;

import static org.forweb.commandos.controller.PersonWebSocketEndpoint.MOVEMENT_SPEED;

@Service
public class PersonService {
    @Autowired
    MovementService movementService;
    @Autowired
    ResponseService responseService;
    @Autowired
    ProjectileService projectileService;
    @Autowired
    LocationService locationService;
    @Autowired
    TurnService turnService;
    @Autowired
    RoomService roomService;

    @Autowired
    Context gameContext;

    @PostConstruct
    public void postConstruct() {
        System.out.println("location service pc");
    }

    public synchronized void kill(Person person, Room room) {
        AbstractWeapon weapon = person.getWeapon();
        WeaponZone candidate = null;
        int topx = (int)person.getX() - PersonWebSocketEndpoint.PERSON_RADIUS;
        int topY = (int)person.getY() - PersonWebSocketEndpoint.PERSON_RADIUS;
        List<AbstractZone> zones = room.getMap().getZones();
        if(weapon.getCurrentClip() > 0) {
            int id = room.getNewWeaponId();
            if(weapon instanceof Pistol) {
                candidate = new PistolZone(topx, topY, id, 0);
            } else if(weapon instanceof AssaultRifle) {
                candidate = new AssaultZone(topx, topY, id, 0);
            } else if(weapon instanceof Shotgun) {
                candidate = new ShotgunZone(topx, topY, id, 0);
            } else if(weapon instanceof SniperRifle) {
                candidate = new SniperZone(topx, topY, id, 0);
            } else if(weapon instanceof Flamethrower) {
                candidate = new FlameZone(topx, topY, id, 0);
            } else if(weapon instanceof Minigun) {
                candidate = new MinigunZone(topx, topY, id, 0);
            } else if(weapon instanceof RocketLauncher) {
                candidate = new RocketZone(topx, topY, id, 0);
            }
            if(candidate != null) {
                candidate.setTemporary(true);
                List<List<AbstractZone>> zonesList = room.getClusterZonesFor(candidate.getX() + candidate.getWidth() / 2, candidate.getY() + candidate.getHeight() / 2);
                for(List<AbstractZone> list : zonesList) {
                    list.add(candidate);
                }
                zones.add(candidate);
            }
        }
        if(person.isSelfFlag() && person.getTeam() > 0) {
            zones.add(person.getTeam() == 1 ? new FlagRedTemp(topx, topY, zones.size(), 0) : new FlagBlueTemp(topx, topY, zones.size(), 0));
        }
        if(person.isOpponentFlag() && person.getTeam() > 0) {
            zones.add(person.getTeam() != 1 ? new FlagRedTemp(topx, topY, zones.size(), 0) : new FlagBlueTemp(topx, topY, zones.size(), 0));
        }
        resetState(person, room);
    }

    public synchronized void reward(Person shooter, Person target, Room room) {
        if(room.isEverybodyReady()) {
            int factor = shooter == target || shooter.getTeam() > 0 && target.getTeam() == shooter.getTeam() ? -1 : 1;
            shooter.setScore(shooter.getScore() + factor);
            if (shooter.getTeam() > 0) {
                if(Map.GameType.tdm.toString().equals(room.getMap().getGameType())) {
                    if (shooter.getTeam() == 1) {
                        room.setTeam1Score(room.getTeam1Score() + factor);
                    } else {
                        room.setTeam2Score(room.getTeam2Score() + factor);
                    }
                }
            }
        }
    }



    public static void resetState(Person person, Room room) {
        resetState(person, room, null);
    }
    public static void resetState(Person person, Room room, List<Integer> respawnIds) {
        if(person.isInPool()){
            return;
        }
        person.setDirection(Direction.NONE);
        person.setLife(PersonWebSocketEndpoint.LIFE_AT_START);
        Respawn respawn = LocationService.getRespawn(room, person, respawnIds);
        if (respawn == null) {
            throw new RuntimeException("No respawn points on map");
        } else {
            person.setLastRespawnId(respawn.getId());
            person.setX(respawn.getX() + PersonWebSocketEndpoint.PERSON_RADIUS);
            person.setY(respawn.getY() + PersonWebSocketEndpoint.PERSON_RADIUS);
        }
        Pistol pistol = new Pistol();
        Knife knife = new Knife();
        knife.setDumpRequire(true);
        pistol.setDumpRequire(true);
        person.setWeapon(pistol);
        List<AbstractWeapon> weaponList = new ArrayList<>();
        weaponList.add(knife);
        weaponList.add(pistol);

        person.setWeaponList(weaponList);
        person.setReloadCooldown(0);
        person.setOpponentFlag(false);
        person.setSelfFlag(false);
        person.setReload(false);
        person.setArmor(0);
        List<Stoppable> listeners = person.getListeners();
        for(int i = listeners.size() - 1; i >= 0; i--) {
            Stoppable stoppable = listeners.get(i);
            if(!stoppable.isStopped()) {
                stoppable.stopExecution();
            }
            listeners.remove(i);
        }
    }


    public void handleDirection(Person person, String message) {
        person.setDirection(Direction.valueOf(message.toUpperCase()));
    }

    public void handlePersons(Collection<Person> persons, Room room) {
        long now = System.currentTimeMillis();
        for (Person person : persons) {
            movementService.onMove(person, room, MOVEMENT_SPEED);
            projectileService.onReload(person, now);
            projectileService.handleFire(person, room);
            turnService.onPersonChangeViewAngle(person);
        }
    }

    public void resetPersonsOnRoomReady(Room room) {
        List<Integer> ids = new ArrayList<>();
        int blue = 0;
        int red = 0;
        for(Person person : room.getPersons().values()) {
            if(person.getTeam() == 1) {
                red++;
            } else if(person.getTeam() == 2) {
                blue++;
            }
        }
        if(!Map.GameType.dm.equals(room.getGameType())) {
            for (Person person : room.getPersons().values()) {
                if (person.getTeam() == 0) {
                    if(blue < red) {
                        person.setTeam(2);
                        blue++;
                    } else if(red < blue){
                        person.setTeam(1);
                        red++;
                    } else {
                        Random r = new Random();
                        int flag = r.nextInt(2);
                        if(flag == 0) {
                            person.setTeam(1);
                            red++;
                        } else {
                            person.setTeam(2);
                            blue++;
                        }
                    }
                }
            }
        }
        for (Person person : room.getPersons().values()) {
            person.setScore(0);
            resetState(person, room, ids);
        }
    }
}
