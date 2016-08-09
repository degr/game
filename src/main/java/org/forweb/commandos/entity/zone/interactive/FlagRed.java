package org.forweb.commandos.entity.zone.interactive;

public class FlagRed extends AbstractFlag{

    public static final String TITLE = "flag_red";
    public FlagRed(int leftTopX, int leftTopY, int id, float angle) {
        super(TITLE, leftTopX, leftTopY, id, angle);
    }

    @Override
    public int getTeam() {
        return 1;
    }

}
