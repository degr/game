var TeamControl = {
    container: null,
    isShown: false,
    teamHolder: null,
    readyCheckbox: null,
    init: function () {
        var ready = TeamControl.buildReadyCheckbox();
        var teamRed = TeamControl.buildTeamSwitch('red', 1);
        var teamBlue = TeamControl.buildTeamSwitch('blue', 2);
        TeamControl.teamHolder = Dom.el('div', TeamControl.isTeamGame() ? '' : 'hidden', [teamRed, teamBlue]);
        TeamControl.container = Dom.el('div', 'team-control', [TeamControl.teamHolder, ready]);
    },
    hide: function() {
        Dom.addClass(TeamControl.container, 'hidden');
    },
    show: function() {
        Dom.removeClass(TeamControl.container, 'hidden');
    },
    updateTeamHolder: function() {
        if(TeamControl.isTeamGame()) {
            Dom.removeClass(TeamControl.teamHolder, 'hidden');
        } else {
            Dom.addClass(TeamControl.teamHolder, 'hidden');
        }
        TeamControl.reset();
        TeamControl.show();
    },
    reset: function() {
        var inputs = TeamControl.container.getElementsByTagName('input');
        var length = inputs.length;
        while(length--) {
            inputs[length].checked = false;
        }
    },
    buildTeamSwitch: function(teamName, value) {
        var id = 'team_'+teamName;
        var radio = Dom.el('input', {type: 'radio', id: id, name: 'team_choose', value: value});
        radio.onclick = function() {
            TeamControl.readyCheckbox.checked = false;
            PlayGround.socket.send('team:' + value);
        };
        var label = Dom.el('label', {'for': id}, [radio, teamName]);
        return Dom.el('div', 'form-control', label);
    },
    buildReadyCheckbox: function () {
        var id = 'ready_to_play';
        var checkbox = Dom.el('input', {type: 'checkbox', id: id, name: id});
        checkbox.onchange = function() {
            var person = PlayGround.entities[PlayGround.owner.id];
            if(person) {
                if(TeamControl.isTeamGame()) {
                    if(person.team) {
                        PlayGround.socket.send('ready:' + (this.checked ? '1' : '0'));
                    } else {
                        Chat.update(0, "Please choose team at first");
                        checkbox.checked = false;
                    }
                } else {
                    PlayGround.socket.send('ready:' + (this.checked ? '1' : '0'));
                }
            } else {
                checkbox.checked = false;
            }
        };
        TeamControl.readyCheckbox = checkbox;
        var label = Dom.el('label', {'for': id}, [checkbox, 'Ready to play']);
        return Dom.el('div', 'form-control', label);
    },
    isTeamGame: function() {
        return PlayGround.map.gameType != 'dm';
    }
};