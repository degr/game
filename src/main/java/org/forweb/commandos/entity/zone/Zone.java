package org.forweb.commandos.entity.zone;

import org.forweb.database.AbstractEntity;

import javax.persistence.Entity;

@Entity
public class Zone extends AbstractEntity {

    private int x;
    private int y;
    private int width;
    private int height;
    private String type;
    private Integer map;

    public Integer getMap() {
        return map;
    }

    public void setMap(Integer map) {
        this.map = map;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
