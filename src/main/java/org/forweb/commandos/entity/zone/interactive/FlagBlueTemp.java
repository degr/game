package org.forweb.commandos.entity.zone.interactive;


public class FlagBlueTemp extends FlagBlue{

    public FlagBlueTemp(int leftTopX, int leftTopY, int id) {
        super(leftTopX, leftTopY, id);
    }

    @Override
    public String getType() {
        return "flag_blue_temp";
    }

    @Override
    public boolean isTemporary() {
        return true;
    }
}
