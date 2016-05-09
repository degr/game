package org.forweb.commandos.entity.ammo;

import java.util.Date;

public abstract class Projectile {
    private Integer id;
    private String type;
    private Integer xStart;
    private Integer yStart;
    private Integer xEnd;
    private Integer yEnd;
    private Integer speed;
    private Long creationTime = new Date().getTime();
    private long now;
    private Long lifeTime;
    private float angle;

    private boolean piercing = false;

    public abstract boolean isInstant();
    public abstract String getName();
    public abstract int getDamage();
    
    public Projectile(int xStart, int yStart, float angle) {
        this.setxStart(xStart);
        this.setyStart(yStart);
        this.setAngle(angle);
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

    public Integer getyStart() {
        return yStart;
    }

    public void setyStart(Integer yStart) {
        this.yStart = yStart;
    }

    public Integer getxStart() {
        return xStart;
    }

    public void setxStart(Integer xStart) {
        this.xStart = xStart;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    
    public Integer getSpeed() {
        return speed;
    }

    public void setSpeed(Integer speed) {
        this.speed = speed;
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

    public void setAngle(float angle) {
        this.angle = angle;
    }

    public float getAngle() {
        return angle;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public void setNow(long now) {
        this.now = now;
    }

    public long getNow() {
        return now;
    }

    public boolean isPiercing() {
        return piercing;
    }
    public void setPiercing(boolean piercing) {
        this.piercing = piercing;
    }

}
