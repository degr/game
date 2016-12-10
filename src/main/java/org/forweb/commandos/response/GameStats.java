package org.forweb.commandos.response;

import org.forweb.commandos.response.dto.Stats;

import java.util.List;
public class GameStats {
    private final String type = "stats";
    private List<Stats> stats;
    private Integer team1Score;

    public Integer getTeam2Score() {
        return team2Score;
    }

    public Integer getTeam1Score() {
        return team1Score;
    }

    private Integer team2Score;

    public String getType() {
        return type;
    }

    public List<Stats> getStats() {
        return stats;
    }

    public void setStats(List<Stats> stats) {
        this.stats = stats;
    }

    public void setTeamStats(Integer team1Score, Integer team2Score) {
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }
}
