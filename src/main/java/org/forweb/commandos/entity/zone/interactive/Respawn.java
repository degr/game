package org.forweb.commandos.entity.zone.interactive;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.shapes.Bounds;

public class Respawn extends AbstractZone {
    public static final String TITLE = "respawn";

    public Respawn(int leftTopX, int leftTopY, int id) {
        super(TITLE, new Bounds(
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
}
