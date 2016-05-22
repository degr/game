package org.forweb.commandos.response;

import org.forweb.commandos.dto.ItemDto;
import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.response.dto.BulletDto;
import org.forweb.commandos.response.dto.OwnerDto;
import org.forweb.commandos.response.dto.PersonDto;

import java.util.List;

public class Update {

    private final List<ItemDto> items;
    private OwnerDto owner;
    private final String type = "update";
    private long time;
    private List<PersonDto> persons;
    private List<BulletDto> projectiles;

    public Update(List<PersonDto> personDto, List<BulletDto> projectiles, List<ItemDto> itemDtos, long time) {
        this.persons = personDto;
        this.projectiles = projectiles;
        this.items = itemDtos;
        this.time = time;
    }

    public String getType() {
        return type;
    }


    public List<BulletDto> getProjectiles() {
        return projectiles;
    }

    public List<PersonDto> getPersons() {
        return persons;
    }

    public OwnerDto getOwner() {
        return owner;
    }

    public void setOwner(OwnerDto owner) {
        this.owner = owner;
    }

    public List<ItemDto> getItems() {
        return items;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

}
