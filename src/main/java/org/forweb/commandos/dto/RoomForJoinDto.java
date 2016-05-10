package org.forweb.commandos.dto;


import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.zone.AbstractZone;

import java.util.List;

public class RoomForJoinDto {
    private int id;
    private int personsCount;
    private int totalSpace;
    private String description;
    private String name;

    private GameMap map;

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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public GameMap getMap() {
        return map;
    }

    public void setMap(GameMap map) {
        this.map = map;
    }
}
