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
            try {
                var obj = JSON.parse(oldConfig);
                if (obj) {
                    for (var k in obj) {
                        Controls[k] = obj[k];
                    }
                }
            } catch (e){
                console.log('something wrong with config keyboard config');
                localStorage.removeItem('keyboard');
            }
        }
        var title = Dom.el('h3', null, 'Keyboard settings');
        var tabs = new Tabs();
        tabs.addTab('Movement', KeyboardSetup.buildMovementSettings());
        tabs.addTab('Fire', KeyboardSetup.buildFireSettings());
        tabs.addTab('HUD', KeyboardSetup.buildHudSettings());
        tabs.addTab('Chat', KeyboardSetup.buildChatSettings());
        
        var esc = Dom.el('input', {type: 'button', value: 'Close'});
        esc.onclick = KeyboardSetup.hide;
        window.addEventListener('keyup', KeyboardSetup.onEscapeButton, false);
        
        KeyboardSetup.container = Dom.el(
            'div',
            {class: 'keyboard-setup hidden'},
            [title, tabs.container, esc]
        );
    },
    buildChatToggler: function() {
        var chatToggler = Dom.el('input', {'class': 'toggler', type: 'button', value: KeyboardSetup.hideChatMessage});
        chatToggler.onclick = function() {
            if(Chat.isHidden) {
                Chat.show();
                chatToggler.value = KeyboardSetup.hideChatMessage;
            } else {
                Chat.hide();
                chatToggler.value = KeyboardSetup.showChatMessage;
            }
        };
        return Dom.el('div', 'form-control', chatToggler);
    },
    buildShowNames: function() {
        var showNames = Dom.el('input', {type: 'button', value: PlayGround.showNames ? 'Hide names' : 'Show names'});
        showNames.onclick = function() {
            PlayGround.showNames = !PlayGround.showNames;
            showNames.value = PlayGround.showNames ? 'Hide names' : 'Show names';
        };

        return Dom.el('div', 'form-control', showNames);
    },
    onEscapeButton: function(e) {
        if(KeyboardSetup.isActive && e.keyCode === 27) {
            KeyboardSetup.hide();
        }
    },
    buildChatSettings: function() {
        var binds = ['bind1', 'bind2', 'bind3', 'bind4', 'bind5', 'bind6', 'bind7', 'bind8', 'bind9'];
        var out = KeyboardSetup.buildGenericSettings(['chat']);
        for(var i = 0; i < binds.length; i++) {
            out.push(KeyboardSetup.createChatInput(binds[i]));
        }
        return out;
    },
    buildFireSettings: function() {
        var out = KeyboardSetup.buildGenericSettings(['nextWeapon', 'previousWeapon', 'reload',
            'knife', 'pistol', 'shotgun', 'assault', 'sniper', 'flamethrower',
            'minigun', 'rocket']);
        out.push(KeyboardSetup.buildNoReload());
        return out;
    },
    buildNoReload: function() {
        var checkbox = Dom.el('input', {type: 'checkbox', id: 'no_passive_reload',title: 'Next weapon on empty ammo'});
        checkbox.checked = PersonActions.noPassiveReload;
        checkbox.onchange = function() {
            PlayGround.noPassiveReload = checkbox.checked;
            PlayGround.send('passiveReload:' + (checkbox.checked ? '0' : '1'));
        };
        var label = Dom.el('label', {'for': 'no_passive_reload', title: 'Next weapon on empty ammo'}, [checkbox, 'No passive reload']);
        return Dom.el('div', 'form-control', label);
    },
    buildMovementSettings: function() {
        return KeyboardSetup.buildGenericSettings(['left', 'top', 'right', 'bottom']);
    },
    buildGenericSettings: function(keys) {
        var out = [];
        for(var i = 0; i < keys.length; i++) {
            out.push(KeyboardSetup.createInput(keys[i]));
        }
        return out;
    },
    buildHudSettings: function() {
        return [
            KeyboardSetup.buildBackgounds(),
            KeyboardSetup.buildDrawBounds(),
            KeyboardSetup.buildShowNames(),
            KeyboardSetup.buildChatToggler()
        ];
    },
    buildBackgounds: function() {
        var buttons = ["Background: "];
        var buildButton = function(i) {
            var out = Dom.el('input', {type: 'button', value: i});
            out.onclick = function() {
                var background = 'url(images/map/background/'+i+'.png)';
                localStorage.setItem('background', background);
                PlayGround.canvas.style.backgroundImage = background;
            };
            return out;
        };
        for(var i = 1; i < 9; i++) {
           buttons.push(buildButton(i));
        }
        return Dom.el('div', 'form-control', buttons);
    },
    buildDrawBounds: function() {
        var checkbox = Dom.el('input', {type: 'checkbox', id: 'draw_bounds'});
        checkbox.checked = PlayGround.drawBounds;
        checkbox.onchange = function() {
            PlayGround.drawBounds = checkbox.checked;
            PlayGround.updateCanvas(PlayGround.map);
        };
        var label = Dom.el('label', {'for': 'draw_bounds'}, [checkbox, 'Draw bounds']);
        return Dom.el('div', 'form-control', label);
    },
    createChatInput: function(key) {
        var container = KeyboardSetup.createInput(key);
        var messageInput = Dom.el('input', {
            type: 'text',
            id: 'chat_' + key,
            value: Chat.binds[key] || ''
        });
        messageInput.onblur = function() {
            Chat.binds[key] = this.value;
            Chat.save();
        };
        container.appendChild(messageInput);
        return container;
    },
    createInput: function(key) {
        if(Controls[key] === undefined) throw "Undefined key in controls: " + key;

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
        return Dom.el('div', 'form-control', [label, input]);
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