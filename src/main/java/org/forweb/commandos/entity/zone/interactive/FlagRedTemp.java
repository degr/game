package org.forweb.commandos.entity.zone.interactive;

import org.forweb.commandos.entity.WebSocketResponse;

public class FlagRedTemp extends FlagRed implements WebSocketResponse{

    public FlagRedTemp(int leftTopX, int leftTopY, int id, float angle) {
        super(leftTopX, leftTopY, id, angle);
    }

    @Override
    public String getType() {
        return "flag_red_temp";
    }

    @Override
    public boolean isTemporary() {
        return true;
    }

    @Override
    public String doResponse() {
        return getType() + ":" + getX() +":" + getY() + ":" + getWidth() + ":" + getHeight();
    }
}
