package org.forweb.commandos.response.dto;

import java.util.List;

public class OwnerDto {
    private int id;
    private int life;
    private int armor;
    private String gun;
    private List<String> guns;
    private int score;

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getGuns() {
        return guns;
    }

    public void setGuns(List<String> guns) {
        this.guns = guns;
    }

    public int getArmor() {
        return armor;
    }

    public void setArmor(int armor) {
        this.armor = armor;
    }

    public int getLife() {
        return life;
    }

    public void setLife(int life) {
        this.life = life;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getGun() {
        return gun;
    }

    public void setGun(String gun) {
        this.gun = gun;
    }
}
