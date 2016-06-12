var TeamControl = {
    container: null,
    init: function () {
        var teamRed = TeamControl.buildTeamSwitch('red', 1);
        var teamBlue = TeamControl.buildTeamSwitch('blue', 2);
        var ready = TeamControl.buildReadyCheckbox();
        TeamControl.container = Dom.el('div', 'team-control', [teamRed, teamBlue, ready]);
    },
    buildTeamSwitch: function(teamName, value) {
        var id = 'team_'+teamName;
        var radio = Dom.el('input', {type: 'radio', id: id, name: 'team_choose', value: value});
        radio.onclick = function() {
            PlayGround.socket.send('team:' + value);
        };
        var label = Dom.el('label', {'for': id}, [radio, teamName]);
        return Dom.el('div', 'form-control', label);
    },
    buildReadyCheckbox: function () {
        var id = 'ready_to_play';
        var checkbox = Dom.el('input', {type: 'checkbox', id: id, name: id});
        checkbox.onchange = function() {
            PlayGround.socket.send('ready:' + (this.checked ? '1' : '0'));
        };
        var label = Dom.el('label', {'for': id}, [checkbox, 'Ready to play']);
        return Dom.el('div', 'form-control', label);
    }
};