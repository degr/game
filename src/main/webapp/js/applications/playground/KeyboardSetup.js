var KeyboardSetup = {
    container: null,
    isActive: false,
    showNames: null,
    hideChatMessage: 'Hide Chat',
    showChatMessage: 'Show Chat',
    show: function() {
        KeyboardSetup.isActive = true;
        Dom.removeClass(KeyboardSetup.container, 'hidden');
    },
    hide: function() {
        KeyboardSetup.isActive = false;
        Dom.addClass(KeyboardSetup.container, 'hidden');
    },
    init: function() {
        var oldConfig = localStorage.getItem('keyboard');
        if(oldConfig) {
            var obj = JSON.parse(oldConfig);
            if(obj) {
                for (var k in obj) {
                    Controls[k] = obj[k];
                }
            }
        }
        var title = Dom.el('h3', null, 'Keyboard settings');
        var buttons = KeyboardSetup.buildButtons();
        KeyboardSetup.chatToggler = Dom.el('input', {'class': 'toggler', type: 'button', value: KeyboardSetup.hideChatMessage});
        KeyboardSetup.chatToggler.onclick = function() {
            if(Chat.isHidden) {
                Chat.show();
                KeyboardSetup.chatToggler.value = KeyboardSetup.hideChatMessage;
            } else {
                Chat.hide();
                KeyboardSetup.chatToggler.value = KeyboardSetup.showChatMessage;
            }
        };
        var esc = Dom.el('input', {type: 'button', value: 'Close'});
        esc.onclick = KeyboardSetup.hide;
        
        KeyboardSetup.showNames = Dom.el('input', {type: 'button', value: PlayGround.showNames ? 'Hide names' : 'Show names'});
        KeyboardSetup.showNames.onclick = function() {
            PlayGround.showNames = !PlayGround.showNames;
            KeyboardSetup.showNames.value = PlayGround.showNames ? 'Hide names' : 'Show names';
        };
        window.addEventListener('keyup', KeyboardSetup.onEscapeButton, false);
        KeyboardSetup.container = Dom.el(
            'div',
            {class: 'keyboard-setup hidden'},
            [title, buttons, KeyboardSetup.showNames, KeyboardSetup.chatToggler, esc]
        );
    },
    onEscapeButton: function(e) {
        if(KeyboardSetup.isActive && e.keyCode === 27) {
            KeyboardSetup.hide();
        }
    },
    buildButtons: function() {
        var buttons = [];
        for(var key in Controls) {
            buttons.push(KeyboardSetup.createInput(key));
        }
        buttons.push(KeyboardSetup.buildAngleMistake());
        buttons.push(KeyboardSetup.buildDrawBounds());
        buttons.push(KeyboardSetup.buildBackgounds())
        return Dom.el('div', 'controls', buttons);
    },
    buildBackgounds: function() {
        var buttons = ["Background: "];
        var buildButton = function(i) {
            var out = Dom.el('input', {type: 'button', value: i});
            out.onclick = function() {
                PlayGround.canvas.style.backgroundImage = 'url(images/map/background/'+i+'.png)';
            };
            return out;
        };
        for(var i = 1; i < 9; i++) {
           buttons.push(buildButton(i));
        }
        return Dom.el('div', null, buttons);
    },
    buildDrawBounds: function() {
        var checkbox = Dom.el('input', {type: 'checkbox', id: 'draw_bounds'});
        checkbox.checked = PlayGround.drawBounds;
        checkbox.onchange = function() {
            PlayGround.drawBounds = checkbox.checked;
            PlayGround.updateCanvas(PlayGround.map);
        };
        var label = Dom.el('label', {'for': 'draw_bounds'}, [checkbox, 'Draw bounds']);
        return Dom.el('div', null, label);
    },
    buildAngleMistake: function() {
        var input = Dom.el('input', {type: 'text', value: PersonActions.angleMistake, id: 'angle_mistake'});
        var label = Dom.el('label', {'for': 'angle_mistake'}, 'Angle Mistake (for slow internet)');
        input.onkeyup = function() {
            var value = parseFloat(input.value);
            if(value >= 0) {
                PersonActions.angleMistake = value;
            } else {
                input.value = PersonActions.angleMistake;
            }
        };
        return Dom.el('div', null, [label, input])
    },
    createInput: function(key) {
        var id = "control_" + key;
        var input = Dom.el('input', {id: id, type:'text', value: KeyboardSetup.translateButton(Controls[key])});
        input.onkeyup = function(e) {
            var value = KeyboardSetup.translateButton(e.keyCode);
            if(value === 'esc') {
                return;
            }
            if(value) {
                this.value = value;
                Controls[key] = e.keyCode;
                localStorage.setItem('keyboard', JSON.stringify(Controls));
            } else {
                this.value = Controls[key];
            }
        };
        var label = Dom.el('label', {'for': id}, key);
        return Dom.el('div', null, [label, input]);
    },
    translateButton: function(code) {
        switch (code) {
            case 9: return 'tab';
            case 13: return 'enter';
            case 16: return 'shift';
            case 17: return 'ctrl';
            case 18: return 'alt';
            case 20: return 'caps lock';
            case 27: return 'esc';
            case 32: return 'space';
            case 33: return 'pg up';
            case 34: return 'pg dn';
            case 35: return 'end';
            case 36: return 'home';
            case 37: return 'ar left';
            case 38: return 'ar top';
            case 39: return 'ar right';
            case 40: return 'ar bottom';
            case 45: return 'ins';
            case 46: return 'del';
            case 91: return 'super';
            case 96: return 'num 0';
            case 97: return 'num 1';
            case 98: return 'num 2';
            case 99: return 'num 3';
            case 100: return 'num 4';
            case 101: return 'num 5';
            case 102: return 'num 6';
            case 103: return 'num 7';
            case 104: return 'num 8';
            case 105: return 'num 9';
            case 106: return '*';
            case 107: return '+';
            case 109: return '-';
            case 111: return '/';
            case 112: return 'f2';
            case 113: return 'f3';
            case 114: return 'f4';
            case 115: return 'f5';
            case 116: return 'f6';
            case 117: return 'f7';
            case 119: return 'f8';
            case 120: return 'f9';
            case 121: return 'f10';
            case 122: return 'f11';
            case 123: return 'f12';
            case 144: return 'num lock';
            case 186: return ';';
            case 187: return '=';
            case 188: return ',';
            case 189: return '-';
            case 190: return '.';
            case 191: return '/';
            case 192: return '~';
            case 219: return '[';
            case 220: return '\\';
            case 221: return ']';
            case 222: return '\'';
            default: return String.fromCharCode(code);
        }
    }
};