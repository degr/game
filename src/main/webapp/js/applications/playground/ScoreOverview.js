Engine.define('ScoreOverview', (function () {
    var Dom = Engine.require('Dom');
    var Controls = Engine.require('Controls');

    var ScoreOverview = {
        container: null,
        team1: 0,
        team2: 0,
        init: function () {
            window.addEventListener('keydown', ScoreOverview.onShow, false);
            window.addEventListener('keyup', ScoreOverview.onHide, false);
            ScoreOverview.container = Dom.el('div', 'score-overview window hidden');
        },
        show: function () {
            ScoreOverview.container.innerHTML = '';
            Dom.removeClass(ScoreOverview.container, 'hidden');
            if (ScoreOverview.team1 > 0 || ScoreOverview.team2 > 0) {
                ScoreOverview.container.appendChild(ScoreOverview.buildTeamScore());
            }
            ScoreOverview.container.appendChild(ScoreOverview.buildScore());
        },
        buildTeamScore: function () {
            return Dom.el('table', null, ScoreOverview.buildTeamRow());
        },
        hide: function () {
            Dom.addClass(ScoreOverview.container, 'hidden');
        },
        onShow: function (e) {
            if (e.keyCode === Controls.score) {
                e.preventDefault();
                ScoreOverview.show();
            }
        },
        onHide: function (e) {
            if (e.keyCode === Controls.score) {
                e.preventDefault();
                ScoreOverview.hide();
            }
        },
        buildScore: function () {
            var even = false;
            var persons = [];
            var PlayGround = Engine.require('PlayGround');
            for (var key in PlayGround.entities) {
                if(PlayGround.entities.hasOwnProperty(key)) {
                    persons.push(PlayGround.entities[key]);
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
                data.push(ScoreOverview.buildRow(persons[i], even));
                even = !even;
            }
            return Dom.el('table', null, data);
        },
        buildRow: function (person, even) {
            var PlayGround = Engine.require('PlayGround');
            var name = PlayGround.owner.id == person.id ? Dom.el('span', 'owner', person.name) : person.name;
            var score = PlayGround.owner.id == person.id ? Dom.el('span', 'owner', person.score) : person.score;
            return Dom.el('tr', even ? 'even' : 'odd', [
                Dom.el('td', null, name),
                Dom.el('td', null, score)
            ]);
        },
        buildTeamRow: function () {
            return Dom.el('tr', null, [
                Dom.el('td', 'red-team', "Red"),
                Dom.el('td', 'red-team', ScoreOverview.team1),
                Dom.el('td', 'blue-team', "Blue"),
                Dom.el('td', 'blue-team', ScoreOverview.team2)
            ]);
        },
        updateTeamScore: function (str) {
            var data = str.split(':');
            if (data.length == 2) {
                ScoreOverview.team1 = data[0];
                ScoreOverview.team2 = data[1];
            }
        }

    };
    return ScoreOverview
})());