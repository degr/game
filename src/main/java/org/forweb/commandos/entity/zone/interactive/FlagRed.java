package org.forweb.commandos.entity.zone.interactive;

public class FlagRed extends AbstractFlag{

    public static final String TITLE = "flag_red";
    public FlagRed(int leftTopX, int leftTopY, int id) {
        super(TITLE, leftTopX, leftTopY, id);
    }

    @Override
    public int getTeam() {
        return 1;
    }
}
