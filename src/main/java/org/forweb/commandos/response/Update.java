package org.forweb.commandos.response;

import org.forweb.commandos.entity.Blood;
import org.forweb.commandos.response.dto.OwnerDto;

import java.util.List;

public class Update {

    private final String type = "update";
    private long time;

    public int getStarted() {
        return started;
    }

    private int started;
    private OwnerDto owner;
    private List<Integer> items;
    private List<String> persons;
    private List<String> projectiles;
    private List<String> messages;
    private List<String> tempZones;
    private List<String> blood;
    private String score;
    public Update(List<String> personDto, List<String> projectiles, List<Integer> itemDtos, List<String> messages, long time, boolean gameStarted, List<String> tempZones, String score, List<String> bloodList) {
        this.persons = personDto;
        this.projectiles = projectiles;
        this.items = itemDtos;
        this.messages = messages;
        this.time = time;
        started = gameStarted ? 1 : 0;
        this.tempZones = tempZones;
        this.score = score;
        this.blood = bloodList;
    }


    public List<String> getTempZones() {
        return tempZones;
    }

    public String getType() {
        return type;
    }


    public List<String> getProjectiles() {
        return projectiles;
    }

    public List<String> getPersons() {
        return persons;
    }

    public OwnerDto getOwner() {
        return owner;
    }

    public void setOwner(OwnerDto owner) {
        this.owner = owner;
    }

    public List<Integer> getItems() {
        return items;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public List<String> getMessages() {
        return messages;
    }


    public String getScore() {
        return score;
    }

    public List<String> getBlood() {
        return blood;
    }
}
