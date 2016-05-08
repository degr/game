package org.forweb.soldiers.dto;


import org.forweb.soldiers.entity.zone.AbstractZone;

import java.util.List;

public class RoomForJoinDto {
    private int id;
    private int personsCount;
    private int totalSpace;
    private int x;
    private int y;
    private String description;
    private String name;
    private List<AbstractZone> zones;

    public int getPersonsCount() {
        return personsCount;
    }

    public void setPersonsCount(int personsCount) {
        this.personsCount = personsCount;
    }

    public int getTotalSpace() {
        return totalSpace;
    }

    public void setTotalSpace(int totalSpace) {
        this.totalSpace = totalSpace;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<AbstractZone> getZones() {
        return zones;
    }

    public void setZones(List<AbstractZone> zones) {
        this.zones = zones;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }
}
