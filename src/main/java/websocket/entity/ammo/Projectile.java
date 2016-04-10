package websocket.entity.ammo;

import java.util.Date;

/**
 * Created by Ror on 09.04.2016.
 */
public abstract class Projectile {
    private String type;
    private Integer xStart;
    private Integer yStart;
    private Integer xEnd;
    private Integer yEnd;
    private Integer speed;
    private Long creationTime = new Date().getTime();
    private Long lifeTime;
    public abstract boolean isInstant();
    
    
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
}
