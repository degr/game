package org.forweb.commandos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.response.dto.OwnerDto;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Update {

    private final String type = "update";
    private Long time;
    private int started;
    private OwnerDto owner;
    private List<String> items;
    private List<String> persons;
    private List<String> projectiles;
    private List<String> messages;
    private List<String> tempZones;
    private List<String> blood;
    private String score;
    private GameMap map;
    public Update(List<String> personDto, List<String> projectiles, List<String> itemDtos, List<String> messages,
                  long time, boolean gameStarted, List<String> tempZones, String score, List<String> bloodList,
                  GameMap map
    ) {
        this.persons = personDto;
        this.projectiles = projectiles;
        this.items = itemDtos;
        this.messages = messages;
        this.time = time;
        started = gameStarted ? 1 : 0;
        this.tempZones = tempZones;
        this.score = score;
        this.blood = bloodList;
        this.map = map;
    }

    public GameMap getMap() {
        return map;
    }

    public List<String> getTempZones() {
        return tempZones;
    }

    public String getType() {
        return type;
    }

    public int getStarted() {
        return started;
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

    public List<String> getItems() {
        return items == null || items.isEmpty() ? null : items;
    }

    public Long getTime() {
        return time == 0 ? null : time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public List<String> getMessages() {
        return messages == null || messages.isEmpty() ? null : messages;
    }


    public String getScore() {
        return score;
    }

    public List<String> getBlood() {
        return blood == null || blood.isEmpty() ? null : blood;
    }
}
