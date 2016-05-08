package org.forweb.soldiers.entity.zone.walls;

import org.forweb.soldiers.entity.zone.AbstractZone;

import java.awt.*;

public class Wall extends AbstractZone {

    private static final String TITLE = "wall";

    public Wall(int leftTopX, int leftTopY, int rightBottomX, int rightBottomY) {
        this(new Rectangle(leftTopX, leftTopY, rightBottomX - leftTopX, rightBottomY - leftTopY));
    }
    public Wall(Rectangle rectangle) {
        super(TITLE, rectangle);
        setPassable(false);
        setShootable(false);
        setStaticSize(false);
    }
}
