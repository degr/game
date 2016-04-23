package org.forweb.soldiers.entity.zone;

import org.forweb.soldiers.controller.PersonWebSocketEndpoint;

import java.awt.*;

public class Respawn extends AbstractZone {
    private static final String TITLE = "respawn";

    public Respawn(int leftTopX, int leftTopY) {
        super(TITLE, new Rectangle(
                leftTopX,
                leftTopY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2)
        );
        setPassable(true);
        setShootable(true);
    }
}
