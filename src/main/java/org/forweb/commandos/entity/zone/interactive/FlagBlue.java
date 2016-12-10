package org.forweb.commandos.entity.zone.interactive;


public class FlagBlue extends AbstractFlag{

    public static final String TITLE = "flag_blue";
    public FlagBlue(int leftTopX, int leftTopY, int id, float angle) {
        super(TITLE, leftTopX, leftTopY, id, angle);
    }

    @Override
    public int getTeam() {
        return 2;
    }
}
