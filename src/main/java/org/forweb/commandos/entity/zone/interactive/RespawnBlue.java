package org.forweb.commandos.entity.zone.interactive;

public class RespawnBlue extends Respawn {

    public static final String TITLE = "respawn_blue";

    public RespawnBlue(int leftTopX, int leftTopY, int id) {
        super(TITLE, leftTopX, leftTopY, id);
    }

    @Override
    public int getTeam() {
        return 2;
    }
}
