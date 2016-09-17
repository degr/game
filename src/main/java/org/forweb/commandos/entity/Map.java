package org.forweb.commandos.entity;

import org.forweb.database.AbstractEntity;

import javax.persistence.*;

@Entity
public class Map extends AbstractEntity {

    public enum GameType {
        dm, tdm, ctf, campaign
    }
    private String title;
    private Integer x;
    private Integer y;
    private Integer maxPlayers;

    @Column(columnDefinition = "enum('dm','tdm','ctf','campaign')")
    @Enumerated(EnumType.STRING)
    private GameType gameType;
    private Integer rating;
    private String mapHash;

    public String getMapHash() {
        return mapHash;
    }

    public void setMapHash(String mapHash) {
        this.mapHash = mapHash;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public GameType getGameType() {
        return gameType;
    }

    public void setGameType(GameType gameType) {
        this.gameType = gameType;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }


    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
