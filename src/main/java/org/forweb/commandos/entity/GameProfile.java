package org.forweb.commandos.entity;

import org.forweb.database.AbstractEntity;

import javax.persistence.Entity;

@Entity
public class GameProfile extends AbstractEntity {

    private String username;
    private Integer user;
    private Boolean arena;

    public Boolean getArena() {
        return arena;
    }

    public void setArena(Boolean arena) {
        this.arena = arena;
    }

    public Integer getUser() {
        return user;
    }

    public void setUser(Integer user) {
        this.user = user;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
