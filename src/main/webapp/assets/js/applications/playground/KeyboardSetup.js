Engine.define(
    'KeyboardSetup',
    ['Dom', 'Controls', 'Tabs', 'PersonActions', 'SoundUtils', 'KeyboardUtils', 'Checkbox'], (function () {

    var Dom = Engine.require('Dom');
    var Controls = Engine.require('Controls');
    var Tabs = Engine.require('Tabs');
    var PersonActions = Engine.require('PersonActions');
    var SoundUtils = Engine.require('SoundUtils');
    var Checkbox = Engine.require('Checkbox');

    var KeyboardSetup = {
        container: null,
        isActive: false,
        showNames: null,
        hideChatMessage: 'Hide Chat',
        showChatMessage: 'Show Chat',
        /**
         * @var PlayGround
         */
        playGround: null,
        context: null,
        /**
         * @var Chat
         */
        chat: null,
        show: function () {
            KeyboardSetup.isActive = true;
            Dom.removeClass(KeyboardSetup.container, 'hidden');
        },
        hide: function () {
            KeyboardSetup.isActive = false;
            Dom.addClass(KeyboardSetup.container, 'hidden');
        },
        init: function () {
            
            var title = Dom.el('h3', null, 'Keyboard settings');
            var tabs = new Tabs();
            tabs.addTab('Movement', KeyboardSetup.buildMovementSettings());
            tabs.addTab('Fire', KeyboardSetup.buildFireSettings());
            tabs.addTab('HUD', KeyboardSetup.buildHudSettings());
            tabs.addTab('Chat', Dom.el('div', 'chat-controls', KeyboardSetup.buildChatSettings()));

            var esc = Dom.el('input', {type: 'button', value: 'Close'});
            esc.onclick = KeyboardSetup.hide;
            this.listeners = {
                keyup: function(e){KeyboardSetup.onEscapeButton(e)}
            };

            KeyboardSetup.container = Dom.el(
                'div',
                {class: 'keyboard-setup hidden'},
                [title, tabs.container, esc]
            );
            Dom.addListeners(KeyboardSetup.container, {onmousedown: function(e){
                e.preventDefault();
                e.stopPropagation();
            }})
        },
        removeListeners: function() {
            Dom.removeListeners(this.listeners);
        },
        clearBackgrounds: function() {
            KeyboardSetup.playGround.canvas.style.backgroundImage = null;
            document.body.style.background = null;
        },

        addListeners: function() {
            Dom.addListeners(this.listeners);
        },
        buildChatToggler: function () {
            var chatToggler = Dom.el('input', {
                'class': 'toggler',
                type: 'button',
                value: KeyboardSetup.hideChatMessage
            });
            var me = this;
            chatToggler.onclick = function () {
                if (me.chat.isHidden) {
                    me.chat.show();
                    chatToggler.value = KeyboardSetup.hideChatMessage;
                } else {
                    me.chat.hide();
                    chatToggler.value = KeyboardSetup.showChatMessage;
                }
            };
            return Dom.el('div', 'form-control', chatToggler);
        },
        buildShowNames: function () {
            var playGround = KeyboardSetup.playGround;
            var showNames = localStorage.getItem('showNames');
            if (showNames) {
                playGround.showNames = !!parseInt(showNames);
            }
            var showNamesEl = Dom.el('input', {
                type: 'button',
                value: playGround.showNames ? 'Hide names' : 'Show names'
            });
            showNamesEl.onclick = function () {
                playGround.showNames = !playGround.showNames;
                showNamesEl.value = playGround.showNames ? 'Hide names' : 'Show names';
                localStorage.setItem('showNames', playGround.showNames ? 1 : 0)
            };

            return Dom.el('div', 'form-control', showNamesEl);
        },
        onEscapeButton: function (e) {
            if (KeyboardSetup.isActive && e.keyCode === 27) {
                KeyboardSetup.hide();
            }
        },
        buildChatSettings: function () {
            var out = KeyboardSetup.buildGenericSettings(['chat']);
            var binds = ['bind1', 'bind2', 'bind3', 'bind4', 'bind5', 'bind6', 'bind7', 'bind8', 'bind9'];
            for (var i = 0; i < binds.length; i++) {
                out.push(KeyboardSetup.createChatInput(binds[i]));
            }
            return out;
        },
        buildFireSettings: function () {
            var out = KeyboardSetup.buildGenericSettings(['nextWeapon', 'previousWeapon', 'reload',
                'knife', 'pistol', 'shotgun', 'assault', 'sniper', 'flamethrower',
                'minigun', 'rocket']);
            out.push(KeyboardSetup.buildNoReload());
            out.push(KeyboardSetup.buildLaserSightControl());
            return out;
        },
        buildLaserSightControl: function () {
            var playGround = KeyboardSetup.playGround;
            var laserSight = localStorage.getItem('laserSight');
            if (laserSight) {
                playGround.laserSight = parseInt(laserSight);
            }

            var buildButton = function (value, label) {
                var id = 'laser_sight_' + value;
                var button = Dom.el('input', {type: 'radio', name: 'laser_sight', id: id});
                if (playGround.laserSight == value) {
                    button.checked = true;
                }
                button.onclick = function () {
                    playGround.laserSight = value;
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
        buildNoReload: function () {
            var checkbox = Dom.el('input', {
                type: 'checkbox',
                id: 'no_passive_reload',
                title: 'Next weapon on empty ammo'
            });
            checkbox.checked = PersonActions.noPassiveReload;
            checkbox.onchange = function () {
                PersonActions.updatePassiveReload(checkbox.checked);
            };
            var label = Dom.el('label', {
                'for': 'no_passive_reload',
                title: 'Next weapon on empty ammo'
            }, [checkbox, 'No passive reload']);
            return Dom.el('div', 'form-control', label);
        },
        buildMovementSettings: function () {
            return KeyboardSetup.buildGenericSettings(['left', 'top', 'right', 'bottom']);
        },
        buildGenericSettings: function (keys) {
            var out = [];
            for (var i = 0; i < keys.length; i++) {
                out.push(KeyboardSetup.createInput(keys[i]));
            }
            return out;
        },
        buildHudSettings: function () {
            return [
                KeyboardSetup.buildBackgrounds(),
                KeyboardSetup.buildDrawBounds(),
                KeyboardSetup.buildShowNames(),
                KeyboardSetup.buildChatToggler(),
                KeyboardSetup.buildScoreButton(),
                KeyboardSetup.buildMuteButton(),
                KeyboardSetup.buildMuteMusicButton(),
                KeyboardSetup.buildHightLightButton(),
                KeyboardSetup.buildBloodTime()
            ];
        },
        buildBloodTime: function () {
            var playGround = KeyboardSetup.playGround;
            var id = 'blood_time';
            var value = localStorage.getItem(id);
            if (value) {
                value = parseInt(value);
            }
            if (value) {
                playGround.bloodTime = value;
            } else {
                value = playGround.bloodTime;
            }
            var input = Dom.el('input', {id: id, type: 'text', value: value});
            /*input.onclick = function (e) {
                input.focus();
            };*/
            input.onkeyup = function (e) {
                e.preventDefault();
                var value = parseInt(this.value);
                if (isFinite(value)) {
                    playGround.bloodTime = value;
                    localStorage.setItem(id, value);
                }
            };
            input.onblur = function (e) {
                e.preventDefault();
                var value = parseInt(this.value);
                if (!isFinite(value))value = 60;
                playGround.bloodTime = value;
                this.value = value;
                localStorage.setItem(id, value);
            };
            var label = Dom.el('label', {'for': id}, 'Time to show blood');
            return Dom.el('div', null, [label, input])
        },
        buildHightLightButton: function () {
            var playGround = KeyboardSetup.playGround;
            var highLight = localStorage.getItem('highlightOwner');
            if (highLight) {
                playGround.highlightOwner = highLight == '1';
            }
            var checkbox = Dom.el('input', {type: 'checkbox', id: 'highlight_checkbox'});
            if (playGround.highlightOwner) {
                checkbox.checked = true;
            }
            checkbox.onclick = function () {
                playGround.highlightOwner = checkbox.checked;
                if (playGround.highlightOwner) {
                    localStorage.setItem('highlightOwner', '1');
                } else {
                    localStorage.removeItem('highlightOwner');
                }
            };
            return Dom.el('div', null, Dom.el('label', {'for': 'highlight_checkbox'}, [checkbox, 'Highligh person']));
        },
        buildMuteMusicButton: function () {
            var muteMusic = KeyboardSetup.context.config.get('muteMusic');
            if (muteMusic == 1) {
                SoundUtils.setMuteMusic(true);
            }
            var checkbox = new Checkbox({name: 'muteMusic', value: SoundUtils.muteMusic, onchange: function(){
                muteMusic = checkbox.getValue();
                KeyboardSetup.context.config.set('muteMusic', muteMusic ? 1 : 0);
                if(muteMusic) {
                    SoundUtils.setMuteMusic(true);
                } else {
                    SoundUtils.setMuteMusic(false);
                }
            }});
            return checkbox.container;
        },
        buildMuteButton: function () {
            var mute = KeyboardSetup.context.config.get('mute');
            if (mute == 1) {
                SoundUtils.setMute(true);
            }
            var checkbox = new Checkbox({name: 'muteSounds', value: SoundUtils.mute, onchange: function(){
                SoundUtils.setMute(checkbox.getValue());
                if (SoundUtils.mute) {
                    KeyboardSetup.context.config.set('mute', 1);
                } else {
                    KeyboardSetup.context.config.remove('mute');
                }
            }});
            return checkbox.container;
        },
        buildScoreButton: function () {
            return KeyboardSetup.createInput('score');
        },
        buildBackgrounds: function () {
            var playGround = KeyboardSetup.playGround;
            var buttons = ["Background: "];
            var back = localStorage.getItem('background');
            var setBackground = function (i) {
                try {
                    var background = 'url(images/map/background/' + i + '.png)';
                    playGround.canvas.style.backgroundImage = background;
                    document.body.style.background = background;
                    localStorage.setItem('background', i);
                } catch (e) {
                    alert("Problem with background instantiation. After game starts, open config, select menu HUD and choose background.");
                }
            };
            if (!back) {
                back = 1;
            }
            if (back) {
                back = parseInt(back);
                setBackground(back);
            }
            var buildButton = function (i) {
                var out = Dom.el('input', {type: 'button', value: i});
                out.onclick = function () {
                    setBackground(i)
                };
                return out;
            };
            for (var i = 1; i < 8; i++) {
                buttons.push(buildButton(i));
            }
            return Dom.el('div', 'form-control', buttons);
        },
        buildDrawBounds: function () {
            var playGround = KeyboardSetup.playGround;
            var checkbox = Dom.el('input', {type: 'checkbox', id: 'draw_bounds'});
            checkbox.checked = playGround.drawBounds;
            checkbox.onchange = function () {
                playGround.drawBounds = checkbox.checked;
                playGround.updateCanvas(playGround.map);
            };
            var label = Dom.el('label', {'for': 'draw_bounds'}, [checkbox, 'Draw bounds']);
            return Dom.el('div', 'form-control', label);
        },
        createChatInput: function (key) {
            var container = KeyboardSetup.createInput(key);
            var me = this;
            var messageInput = Dom.el('input', {
                type: 'text',
                id: 'chat_' + key,
                value: me.chat.binds[key] || ''
            });/*
            messageInput.onclick = function () {
                messageInput.focus();
            };*/
            messageInput.onblur = function () {
                me.chat.binds[key] = this.value;
                me.chat.save();
            };
            container.appendChild(messageInput);
            return container;
        },
        createInput: function (key) {
            if (Controls[key] === undefined) throw "Undefined key in controls: " + key;
            var KeyboardUtils = Engine.require('KeyboardUtils');

            var id = "control_" + key;
            var input = Dom.el('input', {id: id, type: 'text', value: KeyboardUtils.translateButton(Controls[key])});
            input.onclick = function(e){
                input.focus();
                input.setSelectionRange(0, input.value.length)
            };
            input.onkeydown = function (e) {
                e.preventDefault();
            };
            input.onkeyup = function (e) {
                e.preventDefault();
                var value = KeyboardUtils.translateButton(e.keyCode);
                if (value === 'esc') {
                    return;
                }
                if (value) {
                    this.value = value;
                    Controls[key] = e.keyCode;
                    localStorage.setItem('keyboard', JSON.stringify(Controls));
                } else {
                    this.value = Controls[key];
                }
            };
            var label = Dom.el('label', {'for': id}, key);
            return Dom.el('div', 'form-control', [label, input]);
        }
    };
    return KeyboardSetup
}));