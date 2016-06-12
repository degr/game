package org.forweb.commandos.entity;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.weapon.*;

import java.util.ArrayList;
import java.util.List;

public class Person implements WebSocketResponse {

    private int id;

    private int team = 0;
    private Direction direction;
    private double x;
    private double y;
    private float angle;
    private int turnDirection;
    private Integer life = PersonWebSocketEndpoint.LIFE_AT_START;
    private AbstractWeapon weapon;
    private int score;
    private boolean inPool = true;
    private String name;
    private int selectedAngle;

    private Integer lastRespawnId = 0;
    private boolean noPassiveReload;
    private boolean opponentFlag;
    private boolean selfFlag;

    public List<AbstractWeapon> getWeaponList() {
        return weaponList;
    }

    public void setWeaponList(List<AbstractWeapon> weaponList) {
        this.weaponList = weaponList;
    }

    private List<AbstractWeapon> weaponList;
    private boolean isFire;
    private long shotCooldown = 0;
    private long reloadCooldown = 0;
    private boolean isReload;
    private int armor;

    public Person(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }


    public Integer getLife() {
        return life;
    }

    public void setLife(Integer life) {
        this.life = life;
    }

    public long getReloadCooldown() {
        return reloadCooldown;
    }

    public void setReloadCooldown(long reloadCooldown) {
        this.reloadCooldown = reloadCooldown;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public float getAngle() {
        return angle;
    }

    public void setAngle(float angle) {
        this.angle = angle;
    }

    public int getTurnDirection() {
        return turnDirection;
    }

    public void setTurnDirection(int turnDirection) {
        this.turnDirection = turnDirection;
    }

    public AbstractWeapon getWeapon() {
        return weapon;
    }

    public void setWeapon(AbstractWeapon weapon) {
        this.weapon = weapon;
    }

    public void setIsFire(boolean isFire) {
        this.isFire = isFire;
    }

    public boolean isFire() {
        return isFire;
    }

    public void setFire(boolean isFire) {
        this.isFire = isFire;
    }

    public void setShotCooldown(long shotCooldown) {
        this.shotCooldown = shotCooldown;
    }

    public long getShotCooldown() {
        return shotCooldown;
    }

    public void setIsReload(boolean isReload) {
        this.isReload = isReload;
    }

    public boolean isReload() {
        return isReload;
    }

    public void setReload(boolean isReload) {
        this.isReload = isReload;
    }

    public void setArmor(int armor) {
        this.armor = armor;
    }

    public int getArmor() {
        return armor;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public boolean isInPool() {
        return inPool;
    }

    public void setInPool(boolean inPool) {
        this.inPool = inPool;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String doResponse() {
        return getId() + ":" +
                getName() + ":" +
                (getWeapon().getCurrentClip() == 0 || isReload() ? 1 : 0)+ ":" +
                getWeapon().getName() + ":" +
                ((int)getX()) + ":" +
                ((int)getY()) + ":" +
                ((int)getAngle()) + ":" +
                getScore() + ":" +
                (getTeam() != 0 ? getTeam() : "")+ ":" +
                (isOpponentFlag() ? "1" : "0") + ":" +
                (isSelfFlag() ? "1" : "0");
    }

    public void setSelectedAngle(int selectedAngle) {
        this.selectedAngle = selectedAngle;
    }

    public int getSelectedAngle() {
        return selectedAngle;
    }

    public Integer getLastRespawnId() {
        return lastRespawnId;
    }

    public void setLastRespawnId(Integer lastRespawnId) {
        this.lastRespawnId = lastRespawnId;
    }

    public void setNoPassiveReload(boolean noPassiveReload) {
        this.noPassiveReload = noPassiveReload;
    }

    public boolean isNoPassiveReload() {
        return noPassiveReload;
    }

    public int getTeam() {
        return team;
    }

    public void setTeam(int team) {
        this.team = team;
    }

    public void setOpponentFlag(boolean opponentFlag) {
        this.opponentFlag = opponentFlag;
    }

    public boolean isOpponentFlag() {
        return opponentFlag;
    }

    public boolean getSelfFlag() {
        return selfFlag;
    }

    public boolean isSelfFlag() {
        return selfFlag;
    }

    public void setSelfFlag(boolean selfFlag) {
        this.selfFlag = selfFlag;
    }
}