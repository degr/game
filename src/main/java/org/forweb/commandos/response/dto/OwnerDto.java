package org.forweb.commandos.response.dto;

import java.util.List;

public class OwnerDto {
    private List<String> guns;

    private String owner;

    public List<String> getGuns() {
        return guns;
    }

    public void setGuns(List<String> guns) {
        this.guns = guns;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
