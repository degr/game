package org.forweb.soldiers.entity;

import org.forweb.soldiers.controller.PersonWebSocketEndpoint;
import org.forweb.soldiers.entity.weapon.AbstractWeapon;
import org.forweb.soldiers.entity.weapon.Minigun;
import org.forweb.soldiers.entity.weapon.SniperRifle;

public class Person {

    private int id;
    private final String clientKey;
    private Direction direction;
    private int x;
    private int y;
    private float angle;
    private int turnDirection;
    private String hexColor;
    private Integer life = PersonWebSocketEndpoint.LIFE_AT_START;
    
    private AbstractWeapon weapon;
    private boolean isFire;
    private long shotCooldown;

    public Person(int id, String clientKey) {
        this.id = id;
        this.clientKey = clientKey;
        this.weapon = new SniperRifle();
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


    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
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

    public String getClientKey() {
        return clientKey;
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
}