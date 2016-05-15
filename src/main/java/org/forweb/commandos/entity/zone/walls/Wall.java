package org.forweb.commandos.entity.zone.walls;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.shapes.Bounds;

import java.awt.*;

public class Wall extends AbstractZone {

    private static final String TITLE = "wall";

    public Wall(int leftTopX, int leftTopY, int width, int height) {
        this(new Bounds(leftTopX, leftTopY, width, height));
    }

    public Wall(Bounds rectangle) {
        super(TITLE, rectangle);
        setPassable(false);
        setShootable(false);
        setStaticSize(false);
    }
}
