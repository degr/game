package org.forweb.commandos.entity.zone;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.geometry.shapes.Bounds;


public abstract class AbstractItem extends AbstractZone implements Interactive{

    private boolean isAvailable;
    private long timeout;
    private long time;

    public AbstractItem(int topX, int topY, String itemName, int id) {
        super(itemName, new Bounds(
                topX,
                topY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2
        ));
        setPassable(true);
        setShootable(true);
        setAvailable(true);
        setStaticSize(true);
        time = 30000;
        this.setId(id);
    }

    @Override
    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public long getTimeout() {
        return timeout;
    }

    public void setTimeout(long timeout) {
        this.timeout = timeout;
    }

    public long getTime() {
        return time;
    }

}
