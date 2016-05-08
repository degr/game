package org.forweb.soldiers.entity.zone;

import java.awt.*;

public abstract class AbstractZone {

    public AbstractZone(String type, Rectangle rectangle) {
        this.type = type;
        this.setX((int) rectangle.getX());
        this.setY((int) rectangle.getY());
        this.setWidth((int) rectangle.getWidth());
        this.setHeight((int) rectangle.getHeight());
    }

    private int x;
    private int y;
    private int width;
    private int height;
    private String type;
    private boolean passable;
    private boolean isShootable;
    private boolean isStaticSize;

    public boolean isShootable() {
        return isShootable;
    }

    public void setShootable(boolean shootable) {
        isShootable = shootable;
    }

    public boolean isPassable() {
        return passable;
    }

    public void setPassable(boolean passable) {
        this.passable = passable;
    }


    public String getType() {
        return type;
    }


    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public boolean isStaticSize() {
        return isStaticSize;
    }

    public void setStaticSize(boolean staticSize) {
        isStaticSize = staticSize;
    }

}
