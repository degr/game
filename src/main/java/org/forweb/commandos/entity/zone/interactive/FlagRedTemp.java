package org.forweb.commandos.entity.zone.interactive;

public class FlagRedTemp extends FlagRed{

    public FlagRedTemp(int leftTopX, int leftTopY, int id) {
        super(leftTopX, leftTopY, id);
    }

    @Override
    public String getType() {
        return "flag_red_temp";
    }

    @Override
    public boolean isTemporary() {
        return true;
    }
}
