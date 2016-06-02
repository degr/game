package org.forweb.commandos.entity;

import org.forweb.database.AbstractEntity;

import javax.persistence.Entity;

@Entity
public class Map extends AbstractEntity {

    private String title;
    private Integer x;
    private Integer y;

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
