package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.entity.WebSocketResponse;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

public abstract class Projectile implements WebSocketResponse {

    private Integer id;
    private String type;
    private double xStart;
    private double yStart;
    private Integer xEnd;
    private Integer yEnd;
    private Long creationTime = new Date().getTime();
    private Long lifeTime;
    private double angle;
    private double sin;
    private double cos;
    private boolean responseRequired;

    private double radius;
    private final int personId;
    private boolean piercing = false;

    public abstract boolean isInstant();

    public abstract String getName();

    public abstract int getDamage();

    public Projectile(Person person, double angle) {
        this.setxStart(person.getX());
        this.setyStart(person.getY());
        personId = person.getId();
        this.setAngle(angle);
        this.setResponseRequired(true);
    }

    public Integer getyEnd() {
        return yEnd;
    }

    public void setyEnd(Integer yEnd) {
        this.yEnd = yEnd;
    }

    public Integer getxEnd() {
        return xEnd;
    }

    public void setxEnd(Integer xEnd) {
        this.xEnd = xEnd;
    }

    public double getyStart() {
        return yStart;
    }

    public void setyStart(double yStart) {
        this.yStart = yStart;
    }

    public double getxStart() {
        return xStart;
    }

    public void setxStart(double xStart) {
        this.xStart = xStart;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    public Long getCreationTime() {
        return creationTime;
    }

    public Long getLifeTime() {
        return lifeTime;
    }

    public void setLifeTime(Long lifeTime) {
        this.lifeTime = lifeTime;
    }


    public void setAngle(double angle) {
        this.angle = angle;
        angle = angle * Math.PI / 180;
        this.sin = Math.sin(angle);
        this.cos = Math.cos(angle);
    }

    public double getSin() {
        return sin;
    }

    public double getCos() {
        return cos;
    }

    public double getAngle() {
        return angle;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public boolean isPiercing() {
        return piercing;
    }

    public void setPiercing(boolean piercing) {
        this.piercing = piercing;
    }

    public String doResponse() {
        return getId() + ":" +
                getName() + ":" +
                (int) getxStart() + ":" +
                (int) getyStart() + ":" +
                getxEnd() + ":" +
                getyEnd() + ":" +
                (int) getAngle() + ":" +
                getPersonId();
    }

    public int getPersonId() {
        return personId;
    }
    public boolean isResponseRequired() {
        return responseRequired;
    }

    public void setResponseRequired(boolean responseRequired) {
        this.responseRequired = responseRequired;
    }

    public void onDestruct(Room room) {

    }
}
