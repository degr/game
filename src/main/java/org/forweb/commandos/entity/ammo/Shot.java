package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;

import java.util.List;

public class Shot extends Projectile {
    public Shot(Person person, double angle) {
        super(person, angle);
        this.setLifeTime(150L);
        this.setRadius(300);
    }

    public List<SubShot> getSubShots() {
        return subShots;
    }

    public void setSubShots(List<SubShot> subShots) {
        this.subShots = subShots;
    }

    private List<SubShot> subShots;

    @Override
    public boolean isInstant() {
        return true;
    }

    @Override
    public String getName() {
        return "shot";
    }

    @Override
    public int getDamage() {
        return 15;
    }
}
