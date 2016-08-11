Engine.define('TeamControl', (function () {

    var Dom = Engine.require('Dom');
    
    var TeamControl = {
        container: null,
        isShown: false,
        teamHolder: null,
        readyCheckbox: null,
        /**
         * @var PlayGround
         */
        playGround: null,
        init: function () {
            var ready = TeamControl.buildReadyCheckbox();
            var teamRed = TeamControl.buildTeamSwitch('red', 1);
            var teamBlue = TeamControl.buildTeamSwitch('blue', 2);
            TeamControl.teamHolder = Dom.el('div', TeamControl.isTeamGame() ? '' : 'hidden', [teamRed, teamBlue]);
            TeamControl.container = Dom.el('div', 'team-control', [TeamControl.teamHolder, ready]);
            setInterval(function () {
                if (TeamControl.isShown) {
                    Dom.animate(
                        TeamControl.container, {paddingTop: 60}, 2000, 10
                    ).animate(
                        TeamControl.container, {paddingTop: 20}, 600
                    );
                }
            }, 10000)
        },
        hide: function () {
            TeamControl.isShown = false;
            Dom.addClass(TeamControl.container, 'hidden');
        },
        show: function () {
            TeamControl.isShown = true;
            Dom.removeClass(TeamControl.container, 'hidden');
        },
        updateTeamHolder: function () {
            if (TeamControl.isTeamGame()) {
                Dom.removeClass(TeamControl.teamHolder, 'hidden');
            } else {
                Dom.addClass(TeamControl.teamHolder, 'hidden');
            }
            TeamControl.reset();
            TeamControl.show();
        },
        reset: function () {
            var inputs = TeamControl.container.getElementsByTagName('input');
            var length = inputs.length;
            while (length--) {
                inputs[length].checked = false;
            }
        },
        buildTeamSwitch: function (teamName, value) {
            var playGround = TeamControl.playGround;
            var id = 'team_' + teamName;
            var radio = Dom.el('input', {type: 'radio', id: id, name: 'team_choose', value: value});
            radio.onclick = function () {
                TeamControl.readyCheckbox.checked = false;
                playGround.socket.send('team:' + value);
            };
            var label = Dom.el('label', {'for': id}, [radio, teamName]);
            return Dom.el('div', 'form-control', label);
        },
        buildReadyCheckbox: function () {
            var playGround = TeamControl.playGround;
            var id = 'ready_to_play';
            var checkbox = Dom.el('input', {type: 'checkbox', id: id, name: id});
            checkbox.onchange = function () {
                var person = playGround.entities[playGround.owner.id];
                if (person) {
                    if (TeamControl.isTeamGame()) {
                        if (person.team) {
                            playGround.socket.send('ready:' + (this.checked ? '1' : '0'));
                        } else {
                            playGround.chat.update(0, "Please choose team at first");
                            checkbox.checked = false;
                        }
                    } else {
                        playGround.socket.send('ready:' + (this.checked ? '1' : '0'));
                    }
                } else {
                    checkbox.checked = false;
                }
            };
            TeamControl.readyCheckbox = checkbox;
            var label = Dom.el('label', {'for': id}, [checkbox, 'Ready to play']);
            return Dom.el('div', 'form-control', label);
        },
        isTeamGame: function () {
            return TeamControl.playGround.map.gameType != 'dm';
        }
    };
    return TeamControl;
})());