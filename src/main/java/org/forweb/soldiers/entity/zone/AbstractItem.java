package org.forweb.soldiers.entity.zone;

import org.forweb.soldiers.controller.PersonWebSocketEndpoint;

import java.awt.*;

public abstract class AbstractItem extends AbstractZone{

    private boolean isAvailable;
    private long timeout;

    public AbstractItem(int topX, int topY, String itemName) {
        super(itemName, new Rectangle(
                topX,
                topY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2
        ));
        setPassable(true);
        setShootable(true);
        setAvailable(true);
        setStaticSize(true);
    }

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

}
