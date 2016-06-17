var GameStats = {
    container: null,
    statistics: null,
    isShown: false,
    init: function() {
        var title = Dom.el('h3', null, 'THE END');
        GameStats.statistics = Dom.el('div');
        var description = Dom.el('p', null, 'Please refresh browser to start');
        GameStats.container = Dom.el('div', 'game-stats hidden', [title, GameStats.statistics, description]);
    },
    show: function() {
        Dom.removeClass(GameStats.container, 'hidden');
        GameStats.isShown = true;
    },
    hide: function() {
        Dom.addClass(GameStats.container, 'hidden');
        GameStats.isShown = false;
    },
    update: function (stats, team1Score, team2Score) {
        GameStats.statistics.innerHTML = '';
        var content = [];
        for(var i = 0; i < stats.length; i++) {
            GameStats.statistics.appendChild(Dom.el('div', null, decodeURIComponent(stats[i].person) + " " + stats[i].frags));
        }
        if(team1Score >= 0 || team2Score >= 0) {
            GameStats.statistics.appendChild(Dom.el('div', null, "Red score: " + team1Score));
            GameStats.statistics.appendChild(Dom.el('div', null, "Blue score: " + team2Score));
        }
    }
};