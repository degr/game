package org.forweb.commandos.entity.zone;

import org.forweb.commandos.controller.PersonWebSocketEndpoint;
import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.WebSocketResponse;
import org.forweb.geometry.shapes.Bounds;
import org.forweb.geometry.shapes.Rectangle;


public abstract class AbstractItem extends AbstractZone implements Interactive, WebSocketResponse {

    private boolean isAvailable;
    protected boolean shouldUpdate;
    private long timeout;
    private long time;

    @Override
    public void setUpdated() {
        shouldUpdate = false;
    }
    @Override
    public boolean shouldUpdate() {
        return shouldUpdate;
    }

    public AbstractItem(int topX, int topY, String itemName, int id, float angle) {
        super(itemName, new Bounds(
                topX,
                topY,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2,
                PersonWebSocketEndpoint.PERSON_RADIUS * 2
        ), angle);
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
        shouldUpdate = true;
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

    @Override
    public void reset() {
        setAvailable(true);
    }

    @Override
    public String doResponse() {
        return getType() + ":" + getX() + ":" + getY() + ":" +getWidth() + ":" + getHeight();
    }
}
