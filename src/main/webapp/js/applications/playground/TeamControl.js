Engine.define('TeamControl', (function () {

    var Dom = Engine.require('Dom');
    
    function TeamControl(playGround) {
        this.container = null;
        this.isShown = false;
        this.teamHolder = null;
        this.readyCheckbox = null;
        /**
         * @var PlayGround
         */
        this.playGround = playGround;
        var ready = this.buildReadyCheckbox();
        var teamRed = this.buildTeamSwitch('red', 1);
        var teamBlue = this.buildTeamSwitch('blue', 2);
        this.teamHolder = Dom.el('div', this.isTeamGame() ? '' : 'hidden', [teamRed, teamBlue]);
        this.container = Dom.el('div', 'team-control', [this.teamHolder, ready]);
        var me = this;
        setInterval(function () {//todo add destruction logic
            if (me.isShown) {
                Dom.animate(
                    me.container, {paddingTop: 60}, 2000, 10
                ).animate(
                    me.container, {paddingTop: 20}, 600
                );
            }
        }, 10000)
    }
    TeamControl.prototype.hide = function () {
        this.isShown = false;
        Dom.addClass(this.container, 'hidden');
    };
    TeamControl.prototype.show = function () {
        this.isShown = true;
        Dom.removeClass(this.container, 'hidden');
    };
    TeamControl.prototype.updateTeamHolder = function () {
        if (this.isTeamGame()) {
            Dom.removeClass(this.teamHolder, 'hidden');
        } else {
            Dom.addClass(this.teamHolder, 'hidden');
        }
        this.reset();
        this.show();
    };
    TeamControl.prototype.reset = function () {
        var inputs = this.container.getElementsByTagName('input');
        var length = inputs.length;
        while (length--) {
            inputs[length].checked = false;
        }
    };
    TeamControl.prototype.buildTeamSwitch = function (teamName, value) {
        var playGround = this.playGround;
        var id = 'team_' + teamName;
        var radio = Dom.el('input', {type: 'radio', id: id, name: 'team_choose', value: value});
        radio.onclick = function () {
            this.readyCheckbox.checked = false;
            playGround.socket.send('team:' + value);
        };
        var label = Dom.el('label', {'for': id}, [radio, teamName]);
        return Dom.el('div', 'form-control', label);
    };
    TeamControl.prototype.buildReadyCheckbox = function () {
        var playGround = this.playGround;
        var id = 'ready_to_play';
        var checkbox = Dom.el('input', {type: 'checkbox', id: id, name: id});
        var me = this;
        checkbox.onchange = function () {
            var person = playGround.entities[playGround.owner.id];
            if (person) {
                if (me.isTeamGame()) {
                    if (person.team) {
                        playGround.socket.send('ready:' + (checkbox.checked ? '1' : '0'));
                    } else {
                        playGround.chat.update(0, "Please choose team at first");
                        this.checked = false;
                    }
                } else {
                    playGround.socket.send('ready:' + (checkbox.checked ? '1' : '0'));
                }
            } else {
                checkbox.checked = false;
            }
        };
        this.readyCheckbox = checkbox;
        var label = Dom.el('label', {'for': id}, [checkbox, 'Ready to play']);
        return Dom.el('div', 'form-control', label);
    };
    TeamControl.prototype.isTeamGame = function () {
        return this.playGround.map.gameType != 'dm';
    };
    return TeamControl;
})());