Engine.define('ScoreOverview', ['Dom', 'Controls'], (function (Dom, Controls) {

    function ScoreOverview(playGround){
        this.container = null;
        this.team1 = 0;
        this.team2 = 0;
        this.listeners = {
            keydown: function(e){me.onShow(e)},
            keyup:  function(e){me.onHide(e)}
        };
        /**
         * @var PlayGround
         */
        this.playGround = playGround;
        //todo add destruction logic
        var me = this;
        
        window.addEventListener('keydown', me.listeners.keydown, false);
        window.addEventListener('keyup', me.listeners.keyup, false);
        this.container = Dom.el('div', 'score-overview window hidden');
    }
    ScoreOverview.prototype.removeListeners = function() {
        window.removeEventListener('keydown', this.listeners.keydown, false);
        window.removeEventListener('keyup', this.listeners.keyup, false);
    };
    ScoreOverview.prototype.show = function () {
        this.container.innerHTML = '';
        Dom.removeClass(this.container, 'hidden');
        if (this.team1 > 0 || this.team2 > 0) {
            this.container.appendChild(this.buildTeamScore());
        }
        this.container.appendChild(this.buildScore());
    };
    ScoreOverview.prototype.buildTeamScore = function () {
        return Dom.el('table', null, this.buildTeamRow());
    };
    ScoreOverview.prototype.hide = function () {
        Dom.addClass(this.container, 'hidden');
    };
    ScoreOverview.prototype.onShow = function (e) {
        if (e.keyCode === Controls.score) {
            e.preventDefault();
            this.show();
        }
    };
    ScoreOverview.prototype.onHide = function (e) {
        if (e.keyCode === Controls.score) {
            e.preventDefault();
            this.hide();
        }
    };
    ScoreOverview.prototype.buildScore = function () {
        var even = false;
        var persons = [];
        var entities = this.playGround.entities;
        for (var key in entities) {
            if(entities.hasOwnProperty(key)) {
                persons.push(entities[key]);
            }
        }
        persons = persons.sort(function (v1, v2) {
            return v2.score - v1.score;
        });
        var data = [Dom.el('tr', null, [
            Dom.el('th', null, 'Name'),
            Dom.el('th', null, 'Score')
        ])];
        for (var i = 0; i < persons.length; i++) {
            data.push(this.buildRow(persons[i], even));
            even = !even;
        }
        return Dom.el('table', null, data);
    };
    ScoreOverview.prototype.buildRow = function (person, even) {
        var owner = this.playGround.owner;
        var name = owner.id == person.id ? Dom.el('span', 'owner', person.name) : person.name;
        var score = owner.id == person.id ? Dom.el('span', 'owner', person.score) : person.score;
        return Dom.el('tr', even ? 'even' : 'odd', [
            Dom.el('td', null, name),
            Dom.el('td', null, score)
        ]);
    };
    ScoreOverview.prototype.buildTeamRow = function () {
            return Dom.el('tr', null, [
                Dom.el('td', 'red-team', "Red"),
                Dom.el('td', 'red-team', this.team1),
                Dom.el('td', 'blue-team', "Blue"),
                Dom.el('td', 'blue-team', this.team2)
            ]);
        };
    ScoreOverview.prototype.updateTeamScore = function (str) {
        var data = str.split(':');
        if (data.length == 2) {
            this.team1 = data[0];
            this.team2 = data[1];
        }
    };
    return ScoreOverview;
}));