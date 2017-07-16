package org.forweb.commandos.entity;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.weapon.AbstractWeapon;
import org.forweb.commandos.response.Status;
import org.forweb.commandos.service.projectile.Stoppable;
import org.forweb.commandos.utils.Vector;
import org.forweb.geometry.shapes.Circle;

import java.util.ArrayList;
import java.util.List;

import static org.forweb.commandos.controller.PersonWebSocketEndpoint.PERSON_RADIUS;

public class Person implements WebSocketResponse {

    private int id;

    private int team = 0;
    private Direction direction;
    private double x;
    private double y;
    private double angle;
    private int turnDirection;
    private Integer life = PersonWebSocketEndpoint.LIFE_AT_START;
    private AbstractWeapon weapon;
    private int score;
    private boolean inPool = true;
    private String name;
    private double selectedAngle;

    private Integer lastRespawnId = 0;
    private boolean noPassiveReload;
    private boolean opponentFlag;
    private boolean selfFlag;
    private boolean ready;
    private boolean newPerson;
    private List<Stoppable> listeners = new ArrayList<>();
    private Vector customVector;
    private Vector alternativeVector;

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
    private Status status = Status.alive;

    public Person(int id) {
        this.id = id;
    }

    public Circle createCircle(double x, double y) {
        return new Circle(this.getX() + x, this.getY() + y, PERSON_RADIUS);
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

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
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

    public void setShotCooldown(long shotCooldown) {
        this.shotCooldown = shotCooldown;
    }

    public long getShotCooldown() {
        return shotCooldown;
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
        if(isNewPerson()) {
            return doFullResponse();
        } else {
            return getId() + ":" +
                    (getWeapon().getCurrentClip() == 0 || isReload() ? "1" : "") + ":" +
                    getWeapon().getCode() + ":" +
                    ((int) getX()) + ":" +
                    ((int) getY()) + ":" +
                    (Math.floor(getAngle() * 100d) / 100d) + ":" +
                    getStatus().toString();
        }
    }

    public String doFullResponse() {
        return "f:"+
                getId() + ":" +
                getName() + ":" +
                (getWeapon().getCurrentClip() == 0 || isReload() ? 1 : 0) + ":" +
                getWeapon().getCode() + ":" +
                ((int) getX()) + ":" +
                ((int) getY()) + ":" +
                (Math.floor(getAngle() * 100d) / 100d) + ":" +
                getScore() + ":" +
                (getTeam() != 0 ? getTeam() : "") + ":" +
                (isOpponentFlag() ? "1" : "0") + ":" +
                (isSelfFlag() ? "1" : "0") + ":" +
                getStatus().toString();
    }

    public Status getStatus(){
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }

    public void setSelectedAngle(double selectedAngle) {
        this.selectedAngle = selectedAngle;
    }

    public double getSelectedAngle() {
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

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public boolean isReady() {
        return ready;
    }

    public void addListener(Stoppable thread) {
        this.listeners.add(thread);
    }

    public List<Stoppable> getListeners() {
        return listeners;
    }

    public boolean isNewPerson() {
        return newPerson;
    }

    public void setNewPerson(boolean newPerson) {
        this.newPerson = newPerson;
    }

    public Vector getCustomVector() {
        return customVector;
    }

    public void setCustomVector(Vector customVector) {
        this.customVector = customVector;
    }

    public Vector getAlternativeVector() {
        return alternativeVector;
    }

    public void setAlternativeVector(Vector alternativeVector) {
        this.alternativeVector = alternativeVector;
    }
}