package org.forweb.commandos.entity.zone.walls;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.shapes.Bounds;
import org.forweb.geometry.shapes.Point;

public class TiledZone extends AbstractZone {

    private Integer tileId;
    private String tileName;

    public TiledZone(Integer x, Integer y, Tile tile) {
        super("tiled", new Bounds(new Point(x, y), new Point(x + tile.getWidth(), y + tile.getHeight())));
        setStaticSize(true);
        setCustomSprite(tile.getImage());
        setTileId(tile.getId());
        setTileName(tile.getTitle());
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
}
