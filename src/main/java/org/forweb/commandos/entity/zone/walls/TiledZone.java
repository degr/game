package org.forweb.commandos.entity.zone.walls;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.geometry.shapes.Bounds;
import org.forweb.geometry.shapes.Point;

public class TiledZone extends AbstractZone {

    public static final String TITLE = "tiled";

    private Integer tileId;
    private String tileName;
    private Boolean tileset;

    private Integer shiftX;
    private Integer shiftY;

    public TiledZone(Integer x, Integer y, Zone zone, Tile tile) {
        super(TITLE, new Bounds(new Point(x, y), new Point(x + tile.getWidth(), y + tile.getHeight())));
        setStaticSize(true);
        setCustomSprite(tile.getImage());
        setTileId(tile.getId());
        setTileName(tile.getTitle());
        setTileset(tile.getTileset());
        if(tile.getTileset() != null && tile.getTileset()) {
            setShiftX(zone != null ? zone.getShiftX() : 0);
            setShiftY(zone != null ? zone.getShiftY() : 0);
        }
        setPassable(false);
        setShootable(false);
    }


    public String getTileName() {
        return tileName;
    }

    public void setTileName(String tileName) {
        this.tileName = tileName;
    }

    public Integer getTileId() {
        return tileId;
    }

    public void setTileId(Integer tileId) {
        this.tileId = tileId;
    }

    public void setTileset(Boolean tileset) {
        this.tileset = tileset;
    }

    public Boolean getTileset() {
        return tileset;
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
}
