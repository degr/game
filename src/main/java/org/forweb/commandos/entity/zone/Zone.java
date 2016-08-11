package org.forweb.commandos.entity.zone;

import org.forweb.database.AbstractEntity;

import javax.persistence.Entity;
import javax.persistence.criteria.CriteriaBuilder;

@Entity
public class Zone extends AbstractEntity {

    private int x;
    private int y;
    private int width;
    private int height;
    private Integer shiftX;
    private Integer shiftY;
    private Float angle;
    private String type;
    private Integer map;
    private Integer tile;
    private String title;

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


    public void setTitle(String title) {
        this.title = title;
    }


    public Integer getTile() {
        return tile;
    }

    public void setTile(Integer tile) {
        this.tile = tile;
    }

    public String getTitle() {
        return title;
    }

    public Integer getShiftX() {
        return shiftX;
    }

    public void setShiftX(Integer shiftX) {
        this.shiftX = shiftX;
    }


    public Integer getShiftY() {
        return shiftY;
    }

    public void setShiftY(Integer shiftY) {
        this.shiftY = shiftY;
    }


    public Float getAngle() {
        return angle;
    }

    public void setAngle(Float angle) {
        this.angle = angle;
    }

}
