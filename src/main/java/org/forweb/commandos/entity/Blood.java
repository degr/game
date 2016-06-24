package org.forweb.commandos.entity;

public class Blood implements WebSocketResponse {
    private int x;
    private int y;
    public Blood(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getY() {
        return y;
    }

    public int getX() {
        return x;
    }

    @Override
    public String doResponse() {
        return getX() + ":" + getY();
    }
}
