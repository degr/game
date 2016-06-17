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
import org.forweb.commandos.service.person.MovementService;
import org.forweb.commandos.service.person.TurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
                candidate = new PistolZone(topx, topY, id);
            } else if(weapon instanceof AssaultRifle) {
                candidate = new AssaultZone(topx, topY, id);
            } else if(weapon instanceof Shotgun) {
                candidate = new ShotgunZone(topx, topY, id);
            } else if(weapon instanceof SniperRifle) {
                candidate = new SniperZone(topx, topY, id);
            } else if(weapon instanceof Flamethrower) {
                candidate = new FlameZone(topx, topY, id);
            } else if(weapon instanceof Minigun) {
                candidate = new MinigunZone(topx, topY, id);
            } else if(weapon instanceof RocketLauncher) {
                candidate = new RocketZone(topx, topY, id);
            }
            if(candidate != null) {
                candidate.setTemporary(true);
                zones.add(candidate);
            }
        }
        if(person.isSelfFlag() && person.getTeam() > 0) {
            zones.add(person.getTeam() == 1 ? new FlagRedTemp(topx, topY, zones.size()) : new FlagBlueTemp(topx, topY, zones.size()));
        }
        if(person.isOpponentFlag() && person.getTeam() > 0) {
            zones.add(person.getTeam() != 1 ? new FlagRedTemp(topx, topY, zones.size()) : new FlagBlueTemp(topx, topY, zones.size()));
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



    public void resetState(Person person, Room room) {
        resetState(person, room, null);
    }
    public void resetState(Person person, Room room, List<Integer> respawnIds) {
        if(person.isInPool()){
            return;
        }
        person.setDirection(Direction.NONE);
        person.setLife(PersonWebSocketEndpoint.LIFE_AT_START);
        Respawn respawn = locationService.getRespawn(room, person, respawnIds);
        if (respawn == null) {
            throw new RuntimeException("No respawn points on map");
        } else {
            person.setLastRespawnId(respawn.getId());
            person.setX(respawn.getX() + PersonWebSocketEndpoint.PERSON_RADIUS);
            person.setY(respawn.getY() + PersonWebSocketEndpoint.PERSON_RADIUS);
        }
        person.setWeapon(new Pistol());
        List<AbstractWeapon> weaponList = new ArrayList<>();
        weaponList.add(new Knife());
        weaponList.add(person.getWeapon());
        person.setWeaponList(weaponList);
        person.setReloadCooldown(0);
        person.setOpponentFlag(false);
        person.setSelfFlag(false);
        person.setReload(false);
    }


    public void handleDirection(Person person, String message) {
        person.setDirection(Direction.valueOf(message.toUpperCase()));
    }

    public void handlePersons(Collection<Person> persons, Room room) {
        long now = System.currentTimeMillis();
        for (Person person : persons) {
            movementService.onMove(person, room);
            projectileService.onReload(person, now);
            projectileService.handleFire(person, room);
            turnService.onPersonChangeViewAngle(person);
        }
    }

    public void resetPersonsOnRoomReady(Room room) {
        List<Integer> ids = new ArrayList<>();
        for(Person person : room.getPersons().values()) {
            resetState(person, room, ids);
            person.setScore(0);
        }
    }
}
