package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.utils.Vector;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class Flame extends MotionProjectile {

    public static final int RADIUS = 250;

    private boolean isStoped;
    private Person person;

    private static final Random r = new Random();

    public Flame(Person person, double angle) {
        super(person, angle);
        int speed = r.nextInt(3);
        this.setRadius(RADIUS);
        if(speed == 0) {
            this.setLifeTime((long)r.nextInt(500) + 250L );
        } else if (speed == 1) {
            this.setLifeTime((long)r.nextInt(1000) + 1000L );
        } else {
            this.setLifeTime((long)r.nextInt(3000) + 2000L );
        }
        setStoped(false);
        this.person = person;
    }



    @Override
    public boolean isInstant() {
        return false;
    }

    @Override
    public String getName() {
        return "f";
    }

    @Override
    public int getDamage() {
        return 20;
    }

    public boolean isStoped() {
        return isStoped;
    }

    public void setStoped(boolean stoped) {
        isStoped = stoped;
        this.setResponseRequired(true);
        if(stoped) {
            this.setVector(new Vector(0, 0));
        }
    }


    public void onDestruct(Room room) {
        Integer id = room.getProjectilesIds().getAndIncrement();
        room.getProjectiles().put(id, new FlameRemove(person, this));
    }

    public String doResponse() {
        setResponseRequired(false);
        String out = getId() + ":" +
                getName() + ":" +
                (int) getxStart() + ":" +
                (int) getyStart() + ":" +
                getVector().getX() + ":" +
                getVector().getY();
        return out;
    }
}
