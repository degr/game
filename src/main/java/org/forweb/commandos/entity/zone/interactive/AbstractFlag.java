package org.forweb.commandos.entity.zone.interactive;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Interactive;
import org.forweb.geometry.shapes.Bounds;


public abstract class AbstractFlag extends AbstractZone implements Interactive {

    public abstract int getTeam();

    private boolean isAvailable = true;

    @Override
    public boolean isTemporary() {
        return false;
    }

    public AbstractFlag(String type, int leftTopX, int leftTopY, int id) {
        super(type, new Bounds(
                leftTopX,
                leftTopY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2)
        );
        this.setId(id);
        setPassable(true);
        setShootable(true);
        setStaticSize(true);
    }


    @Override
    public void onEnter(Person person, Room room) {
        if(room.isEverybodyReady()) {
            if (person.getTeam() != 0) {
                if (person.getTeam() != getTeam()) {
                    if (isAvailable()) {
                        this.isAvailable = false;
                        person.setOpponentFlag(true);
                    }
                } else {
                    if(isAvailable()) {
                        if(isTemporary()) {
                            person.setSelfFlag(true);
                            this.isAvailable = false;
                        } else {
                            if (person.isOpponentFlag()) {
                                person.setOpponentFlag(false);
                                room.updateFlag(getTeam());
                                if (getTeam() == 1) {
                                    room.setTeam1Score(room.getTeam1Score() + 1);
                                } else {
                                    room.setTeam2Score(room.getTeam2Score() + 1);
                                }
                                if(room.getTeam1Score() >= 5 || room.getTeam2Score() >= 5) {
                                    room.setShowStats(true);
                                }
                            }
                        }
                    } else {
                        if (person.getSelfFlag()) {
                            person.setSelfFlag(false);
                            this.isAvailable = true;
                        }
                    }
                }
            }
        }
    }

    @Override
    public boolean isAvailable() {
        return isAvailable;
    }

    public void reset() {
        isAvailable = true;
    }
}
