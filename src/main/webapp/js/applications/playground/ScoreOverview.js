var ScoreOverview = {
    container: null,
    init: function() {
        window.addEventListener('keydown', ScoreOverview.onShow, false);
        window.addEventListener('keyup', ScoreOverview.onHide, false);
        ScoreOverview.container = Dom.el('div', 'score-overview window hidden');
    },
    show: function() {
        ScoreOverview.container.innerHTML = '';
        Dom.removeClass(ScoreOverview.container, 'hidden');
        ScoreOverview.container.appendChild(ScoreOverview.buildScore());
    },
    hide: function() {
        Dom.addClass(ScoreOverview.container, 'hidden');
    },
    onShow: function(e) {
        if(e.keyCode === Controls.score) {
            e.preventDefault();
            ScoreOverview.show();
        }
    },
    onHide: function(e) {
        if(e.keyCode === Controls.score) {
            e.preventDefault();
            ScoreOverview.hide();
        }
    },
    buildScore: function() {
        var even = false;
        var persons = [];
        for(var key in PlayGround.entities) {
            persons.push(PlayGround.entities[key]);
        }
        persons = persons.sort(function(v1, v2) {
            return v2.score - v1.score;
        });
        var data = [Dom.el('tr', null, [
            Dom.el('th', null, 'Name'),
            Dom.el('th', null, 'Score')
        ])];
        for(var i = 0; i < persons.length; i++) {
            data.push(ScoreOverview.buildRow(persons[i], even));
            even = !even;
        }
        return Dom.el('table', null, data);
    },
    buildRow: function (person, even) {
        var name = PlayGround.owner.id == person.id ? Dom.el('span', 'owner', person.name) : person.name; 
        var score = PlayGround.owner.id == person.id ? Dom.el('span', 'owner', person.score) : person.score; 
        return Dom.el('tr', even ? 'even' : 'odd', [
            Dom.el('td', null, name),
            Dom.el('td', null, score)
        ]);
    }
    
};