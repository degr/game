package org.forweb.commandos.entity;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.weapon.*;

import java.util.ArrayList;
import java.util.List;

public class Person implements WebSocketResponse {

    private int id;
    private Direction direction;
    private double x;
    private double y;
    private float angle;
    private int turnDirection;
    private String hexColor;
    private Integer life = PersonWebSocketEndpoint.LIFE_AT_START;
    private AbstractWeapon weapon;
    private int score;
    private boolean inPool = true;
    private String name;
    private int selectedAngle;

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
    
    public String getHexColor() {
        return hexColor;
    }

    public Integer getLife() {
        return life;
    }

    public void setLife(Integer life) {
        this.life = life;
    }

    public void setHexColor(String hexColor) {
        this.hexColor = hexColor;
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
        return getId() + ":" + getLife() + ":" + getArmor() + ":" + getScore() + ":" + getWeapon().getName();
    }

    public String doCommonResponse() {
        return getId() + ":" +
                getName() + ":" +
                getHexColor() + ":" +
                (getWeapon().getCurrentClip() == 0 || isReload() ? 1 : 0)+ ":" +
                getWeapon().getName() + ":" +
                ((int)getX()) + ":" +
                ((int)getY()) + ":" +
                ((int)getAngle());
    }

    public void setSelectedAngle(int selectedAngle) {
        this.selectedAngle = selectedAngle;
    }

    public int getSelectedAngle() {
        return selectedAngle;
    }
}