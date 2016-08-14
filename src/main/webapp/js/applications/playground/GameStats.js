Engine.modules.GameStats = (function () {

    var Dom = Engine.require('Dom');
    
    function GameStats(playGround, personTracker, teamControl) {
        if(!teamControl) {
            throw "TeamControl is required for GameStats"
        }
        if(!personTracker) {
            throw "PersonTracker is required for GameStats"
        }
        if(!playGround) {
            throw "PlayGround is required for GameStats"
        }
        this.container = null;
        this.statistics = Dom.el('div');
        this.isShown = false;
        this.personTracker = personTracker;
        /**
         * @var PlayGround
         */
        this.playGround = playGround;

        var title = Dom.el('h3', null, 'THE END');
        var ready = Dom.el('input', {type: 'button', value: 'restart'});
        var me = this;
        ready.onclick = function () {
            playGround.gameStarted = true;
            playGround.statsShown = false;
            personTracker.start();
            me.hide();
            teamControl.readyCheckbox.checked = false;
            playGround.socket.send('restart');
            playGround.blood = [];
        };
        var description = Dom.el('p', null, ['Please refresh browser to start new game, or press ', ready]);
        this.container = Dom.el('div', 'game-stats hidden', [title, this.statistics, description]);
    }
    GameStats.prototype.show = function () {
            Dom.removeClass(this.container, 'hidden');
            this.isShown = true;
    };
    GameStats.prototype.hide = function () {
        Dom.addClass(this.container, 'hidden');
        this.isShown = false;
    };
    GameStats.prototype.update = function (stats, team1Score, team2Score) {
        this.statistics.innerHTML = '';
        for (var i = 0; i < stats.length; i++) {
            this.statistics.appendChild(Dom.el('div', null, decodeURIComponent(stats[i].person) + " " + stats[i].frags));
        }
        if (team1Score >= 0 || team2Score >= 0) {
            this.statistics.appendChild(Dom.el('div', null, "Red score: " + team1Score));
            this.statistics.appendChild(Dom.el('div', null, "Blue score: " + team2Score));
        }
    };

    return GameStats
})();