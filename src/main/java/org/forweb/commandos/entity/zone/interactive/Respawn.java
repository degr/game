package org.forweb.commandos.entity.zone.interactive;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.zone.AbstractZone;

import java.awt.*;

public class Respawn extends AbstractZone {
    public static final String TITLE = "respawn";

    public Respawn(int leftTopX, int leftTopY) {
        super(TITLE, new Rectangle(
                leftTopX,
                leftTopY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2)
        );
        setPassable(true);
        setShootable(true);
        setStaticSize(true);
    }
}
