package org.forweb.commandos.entity.zone;

import org.forweb.geometry.shapes.Bounds;
import org.forweb.geometry.shapes.Rectangle;

public abstract class AbstractZone {

    private Integer id;
    private float angle;
    private Rectangle rectangle;

    public AbstractZone(String type, Bounds bounds, float angle) {
        this.type = type;
        this.setX((int) bounds.getX());
        this.setY((int) bounds.getY());
        this.setWidth((int) bounds.getWidth());
        this.setHeight((int) bounds.getHeight());
        this.setAngle(angle);
    }

    private int x;
    private int y;
    private int width;
    private int height;
    private String type;
    private boolean passable;
    private boolean isShootable;
    private boolean isStaticSize;
    private String customSprite;

    public void setType(String type) {
        this.type = type;
    }

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomSprite() {
        return customSprite;
    }

    public void setCustomSprite(String customSprite) {
        this.customSprite = customSprite;
    }

    public void setAngle(float angle) {
        this.angle = angle;
    }

    public float getAngle() {
        return angle;
    }

    public Rectangle getRectangle() {
        if(rectangle == null) {
            rectangle = new Rectangle(new Bounds(getX(), getY(), getWidth(), getHeight()), getAngle());
        }
        return rectangle;
    }
}
