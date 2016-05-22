package org.forweb.commandos.response;

import org.forweb.commandos.response.dto.Stats;

import java.util.List;
public class GameStats {
    private final String type = "stats";
    private List<Stats> stats;

    public String getType() {
        return type;
    }

    public List<Stats> getStats() {
        return stats;
    }

    public void setStats(List<Stats> stats) {
        this.stats = stats;
    }

}
