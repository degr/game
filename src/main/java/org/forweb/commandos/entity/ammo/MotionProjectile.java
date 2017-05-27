package org.forweb.commandos.entity.ammo;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.Room;
import org.forweb.commandos.utils.Vector;

import static org.forweb.commandos.controller.PersonWebSocketEndpoint.FRAME_RATE;

public abstract class MotionProjectile extends Projectile {

    private final Person person;
    private Vector vector;

    protected abstract Projectile generateRemovable();

    public MotionProjectile(Person person, double angle) {
        super(person, angle);
        this.person = person;
    }

    public void setLifeTime(Long lifeTime) {
        super.setLifeTime(lifeTime);
        double speed = getRadius() * FRAME_RATE/ (lifeTime);
        this.vector = new Vector(
                speed * this.getCos(),
                speed * this.getSin()
        );
    }

    @Override
    public boolean isInstant() {
        return false;
    }

    public Vector getVector() {
        return vector;
    }

    public void setVector(Vector vector) {
        this.vector = vector;
    }

    public Person getPerson() {
        return person;
    }

    public void onDestruct(Room room) {
        Integer id = room.getProjectilesIds().getAndIncrement();
        room.getProjectiles().put(id, generateRemovable());
    }
}
