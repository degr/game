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
        this.readyWrapper = this.buildReadyCheckbox();
        var teamRed = this.buildTeamSwitch('red', 1);
        var teamBlue = this.buildTeamSwitch('blue', 2);
        this.teamHolder = Dom.el('div', this.isTeamGame() ? '' : 'hidden', [teamRed, teamBlue]);
        this.container = Dom.el('div', 'team-control', [this.teamHolder, this.readyWrapper]);
        Dom.addListeners(this.container, {onmousedown: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.preventBubble = true;
        }})
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
            Dom.addClass(this.readyWrapper, 'hidden');
        } else {
            Dom.addClass(this.teamHolder, 'hidden');
            Dom.removeClass(this.readyWrapper, 'hidden');
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
        var me = this;
        var id = 'team_' + teamName;
        var radio = Dom.el('input', {type: 'radio', id: id, name: 'team_choose', value: value});
        radio.onclick = function () {
            me.readyCheckbox.checked = false;
            playGround.socket.send('team:' + value);
            playGround.socket.send('ready:1');
        };
        var label = Dom.el('label', {'for': id}, [radio, teamName]);
        return Dom.el('div', 'form-control', label);
    };
    TeamControl.prototype.buildReadyCheckbox = function () {
        var playGround = this.playGround;
        var id = 'ready_to_play';
        var checkbox = Dom.el('input', {type: 'checkbox', id: id, name: id});
        checkbox.onchange = function () {
            var person = playGround.entities[playGround.owner.id];
            if (person) {
                playGround.socket.send('ready:' + (checkbox.checked ? '1' : '0'));
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
}));