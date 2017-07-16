package org.forweb.commandos.entity;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.entity.zone.Zone;
import org.forweb.geometry.shapes.Bounds;

import java.util.List;

public class GameMap {
    private Integer id;
    private Integer x;
    private Integer y;
    private String name;
    private List<Zone> zonesDto;
    private List<AbstractZone> zones;
    private Integer maxPlayers;
    private String gameType;
    private Integer rating;
    private String mapHash;
    private Bounds bounds;

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
        if(this.y != null) {
            this.bounds = new Bounds(0, 0, x, y);
        }
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
        if(this.x != null) {
            this.bounds = new Bounds(0, 0, x, y);
        }
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<AbstractZone> getZones() {
        return zones;
    }

    public void setZones(List<AbstractZone> zones) {
        this.zones = zones;
    }

    public List<Zone> getZonesDto() {
        return zonesDto;
    }

    public void setZonesDto(List<Zone> zonesDto) {
        this.zonesDto = zonesDto;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getRating() {
        return rating;
    }

    public String getMapHash() {
        return mapHash;
    }

    public void setMapHash(String mapHash) {
        this.mapHash = mapHash;
    }

    public Bounds getBounds() {
        return bounds;
    }
}
