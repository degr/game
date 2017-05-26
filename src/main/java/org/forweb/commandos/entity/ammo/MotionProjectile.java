package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.utils.Vector;

import static org.forweb.commandos.controller.PersonWebSocketEndpoint.FRAME_RATE;

public abstract class MotionProjectile extends Projectile {

    private Vector vector;


    public MotionProjectile(Person person, double angle) {
        super(person, angle);
    }

    public void setLifeTime(Long lifeTime) {
        super.setLifeTime(lifeTime);
        double speed = getRadius() * FRAME_RATE/ (lifeTime);
        this.vector = new Vector(
                speed * this.getCos(),
                speed * this.getSin()
        );
    }


    public Vector getVector() {
        return vector;
    }

    public void setVector(Vector vector) {
        this.vector = vector;
    }

}
