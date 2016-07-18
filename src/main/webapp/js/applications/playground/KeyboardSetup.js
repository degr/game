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
        tabs.addTab('Chat', Dom.el('div', 'chat-controls', KeyboardSetup.buildChatSettings()));
        
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
        var showNames = localStorage.getItem('showNames');
        if(showNames) {
            PlayGround.showNames = !!parseInt(showNames);
        }
        var showNamesEl = Dom.el('input', {type: 'button', value: PlayGround.showNames ? 'Hide names' : 'Show names'});
        showNamesEl.onclick = function() {
            PlayGround.showNames = !PlayGround.showNames;
            showNamesEl.value = PlayGround.showNames ? 'Hide names' : 'Show names';
            localStorage.setItem('showNames', PlayGround.showNames ? 1 : 0)
        };

        return Dom.el('div', 'form-control', showNamesEl);
    },
    onEscapeButton: function(e) {
        if(KeyboardSetup.isActive && e.keyCode === 27) {
            KeyboardSetup.hide();
        }
    },
    buildChatSettings: function() {
        var out = KeyboardSetup.buildGenericSettings(['chat']);
        var binds = ['bind1', 'bind2', 'bind3', 'bind4', 'bind5', 'bind6', 'bind7', 'bind8', 'bind9'];
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
        out.push(KeyboardSetup.buildLaserSightControl());
        return out;
    },
    buildLaserSightControl: function() {
        var laserSight = localStorage.getItem('laserSight');
        if(laserSight) {
            PlayGround.laserSight = parseInt(laserSight);
        }
        
        var buildButton = function(value, label) {
            var id = 'laser_sight_' + value;
            var button = Dom.el('input', {type: 'radio', name: 'laser_sight', id: id});
            if(PlayGround.laserSight == value) {
                button.checked = true;
            }
            button.onclick = function() {
                PlayGround.laserSight = value;
                localStorage.setItem('laserSight', value);
            };
            return Dom.el('div', null, Dom.el('label', {'for': id}, [button, label]));
        };
        return Dom.el('div', null, [
            buildButton(0, 'No laser sight'),
            buildButton(1, 'Laser sight only on sniper rifle'),
            buildButton(2, 'Laser sight on all weapons')
        ])
    },
    buildNoReload: function() {
        var checkbox = Dom.el('input', {type: 'checkbox', id: 'no_passive_reload',title: 'Next weapon on empty ammo'});
        checkbox.checked = PersonActions.noPassiveReload;
        checkbox.onchange = function() {
            PersonActions.updatePassiveReload(checkbox.checked);
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
            KeyboardSetup.buildChatToggler(),
            KeyboardSetup.buildScoreButton(),
            KeyboardSetup.buildMuteButton(),
            KeyboardSetup.buildHightLightButton(),
            KeyboardSetup.buildBloodTime()
        ];
    },
    buildBloodTime: function () {
        var id = 'blood_time';
        var value = localStorage.getItem(id);
        if(value) {
            value = parseInt(value);
        }
        if(value) {
            PlayGround.bloodTime = value;
        } else {
            value = PlayGround.bloodTime;
        }
        var input = Dom.el('input', {id: id, type: 'text', value: value});
        input.onkeyup = function(e) {
            e.preventDefault();
            var value = parseInt(this.value);
            if(!isFinite(value))value = 60;
            PlayGround.bloodTime = value;
            this.value = value;
            localStorage.setItem(id, value);
        };
        var label = Dom.el('label', {'for': id}, 'Time to show blood');
        return Dom.el('div', null, [label, input])
    },
    buildHightLightButton: function() {
        var highLight = localStorage.getItem('highlightOwner');
        if(highLight) {
            PlayGround.highlightOwner = highLight == '1';
        }
        var checkbox = Dom.el('input', {type: 'checkbox', id: 'highlight_checkbox'});
        if(PlayGround.highlightOwner) {
            checkbox.checked = true;
        }
        checkbox.onclick = function() {
            PlayGround.highlightOwner = checkbox.checked;
            if(SoundUtils.mute) {
                localStorage.setItem('highlightOwner', '1');
            } else {
                localStorage.removeItem('highlightOwner');
            }
        };
        return Dom.el('div', null, Dom.el('label', {'for': 'highlight_checkbox'}, [checkbox, 'Highligh person']));
    },
    buildMuteButton: function() {
        var mute = localStorage.getItem('mute');
        if(mute == '1') {
            SoundUtils.setMute(true);
        }
        var checkbox = Dom.el('input', {type: 'checkbox', id: 'mute_checkbox'});
        if(SoundUtils.mute) {
            checkbox.checked = true;
        }
        checkbox.onclick = function() {
            SoundUtils.setMute(checkbox.checked);
            if(SoundUtils.mute) {
                localStorage.setItem('mute', '1');
            } else {
                localStorage.removeItem('mute');
            }
        };
        return Dom.el('div', null, Dom.el('label', {'for': 'mute_checkbox'}, [checkbox, 'Mute (no sound)']));
    },
    buildScoreButton: function () {
        return KeyboardSetup.createInput('score');
    },
    buildBackgounds: function() {
        var buttons = ["Background: "];
        var back = localStorage.getItem('background');
        var setBackground = function(i) {
            try {
                var background = 'url(images/map/background/' + i + '.png)';
                localStorage.setItem('background', background);
                PlayGround.canvas.style.backgroundImage = background;
                document.body.style.background = background;
                localStorage.setItem('background', i);
            } catch (e){
                alert("Problem with background instantiation. After game starts, open config, select menu HUD and choose background.");
            }
        };
        if(!back) {
            back = 1;
        }
        if(back) {
            back = parseInt(back);
            setBackground(back);
        }
        var buildButton = function(i) {
            var out = Dom.el('input', {type: 'button', value: i});
            out.onclick = function(){
                setBackground(i)
            };
            return out;
        };
        for(var i = 1; i < 8; i++) {
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
        var input = Dom.el('input', {id: id, type:'text', value: KeyboardUtils.translateButton(Controls[key])});
        input.onkeydown = function (e) {
            e.preventDefault();
        };
        input.onkeyup = function(e) {
            e.preventDefault();
            var value = KeyboardUtils.translateButton(e.keyCode);
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

};