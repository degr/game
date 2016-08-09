package org.forweb.commandos.entity.zone.interactive;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.shapes.Bounds;

public class Respawn extends AbstractZone {
    public static final String TITLE = "respawn";

    public Respawn(int leftTopX, int leftTopY, int id, float angle) {
        this(TITLE, leftTopX, leftTopY, id, angle);
    }
    protected Respawn(String title, int leftTopX, int leftTopY, int id, float angle) {
        super(title, new Bounds(
                leftTopX,
                leftTopY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2),
                angle
        );
        this.setId(id);
        setPassable(true);
        setShootable(true);
        setStaticSize(true);
    }

    public int getTeam() {
        return 0;
    }
}
