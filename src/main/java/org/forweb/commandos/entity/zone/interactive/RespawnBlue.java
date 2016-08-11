package org.forweb.commandos.entity.zone.interactive;

public class RespawnBlue extends Respawn {

    public static final String TITLE = "respawn_blue";

    public RespawnBlue(int leftTopX, int leftTopY, int id, float angle) {
        super(TITLE, leftTopX, leftTopY, id, angle);
    }

    @Override
    public int getTeam() {
        return 2;
    }
}
