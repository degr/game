package org.forweb.commandos.response;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.commandos.response.dto.BulletDto;
import org.forweb.commandos.response.dto.OwnerDto;
import org.forweb.commandos.response.dto.PersonDto;

import java.util.List;

public class Update {

    private OwnerDto owner;
    private final String type = "update";
    private List<PersonDto> persons;
    private List<BulletDto> projectiles;
    private List<AbstractZone> zones;

    public Update(List<PersonDto> personDto, List<BulletDto> projectiles) {
        this.persons = personDto;
        this.projectiles = projectiles;
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

    public void setZones(List<AbstractZone> zones) {
        this.zones = zones;
    }

    public List<AbstractZone> getZones() {
        return zones;
    }
}
