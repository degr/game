package org.forweb.commandos.entity.zone.interactive;


public class RespawnRed extends Respawn {

    public static final String TITLE = "respawn_red";

    public RespawnRed(int leftTopX, int leftTopY, int id, float angle) {
        super(TITLE, leftTopX, leftTopY, id, angle);
    }

    @Override
    public int getTeam() {
        return 1;
    }
}