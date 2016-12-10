package org.forweb.commandos.entity.zone.walls;

import org.forweb.database.AbstractEntity;

import javax.persistence.Entity;

@Entity
public class Tile extends AbstractEntity{
    private String title;
    private Integer width;
    private Integer height;
    private String image;
    private Boolean isTileset;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getTileset() {
        return isTileset;
    }

    public void setTileset(Boolean tileset) {
        isTileset = tileset;
    }

}
