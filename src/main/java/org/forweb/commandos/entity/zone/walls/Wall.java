package org.forweb.commandos.entity.zone.walls;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.shapes.Bounds;

public class Wall extends AbstractZone {

    public static final String TITLE = "wall";

    public Wall(int leftTopX, int leftTopY, int width, int height, Float angle) {
        this(new Bounds(leftTopX, leftTopY, width, height), angle);
    }

    public Wall(Bounds rectangle, float angle) {
        super(TITLE, rectangle, angle);
        setPassable(false);
        setShootable(false);
        setStaticSize(false);
    }
}
