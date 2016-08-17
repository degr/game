Engine.define('Chat', 'Dom', (function (Dom) {
    
    var Chat = function (playGround) {
        this.container = null;
        this.isTextareaShown = false;
        this.screen = Dom.el('div', 'console');
        this.textarea = Dom.el('textarea', this.isTextareaShown ? '' : 'hidden');
        this.active = null;
        this.isHidden = false;
        this.binds = {};
        this.wasMoved = false;
        /**
         * @var PlayGround
         */
        this.playGround = playGround;
        var me = this;
        this.listners = {
            keyup: function (e) {me.onChatKeyup(e)}
        };
        Dom.addListeners(this.listners);
        try {
            var value = localStorage.getItem('chat');
            if (value) {
                this.binds = JSON.parse(value);
            }
        } catch (e) {
            this.binds = {};
        }
        this.textarea.onkeyup = function(e){me.onkeyup(e)};
        this.textarea.onfocus = function () {
            me.active = true;
            me.isTextareaShown = true;
            Engine.require('PersonActions').stopFire()
        };
        this.textarea.onblur = function () {
            me.active = false;
            me.isTextareaShown = false;
            Dom.addClass(me.textarea, 'hidden');
        };

        this.container = Dom.el('div', 'chat', [this.screen, this.textarea]);
        var onClick = function (e) {
            //e.preventDefault();
            e.stopPropagation();
            e.preventBubble = true;
        };
        var container = this.container;
        container.onclick = onClick;
        container.onmousedown = onClick;
        container.onmouseup = onClick;
        this.screen.onmouseover = function (e) {
            if (!me.active) {
                e.preventDefault();
                if (me.wasMoved) {
                    container.style.left = '66px';
                    container.style.right = 'auto';
                } else {
                    container.style.left = 'auto';
                    container.style.right = '66px';
                }
                me.wasMoved = !me.wasMoved;
            }
        };
    };

    Chat.prototype.removeListeners = function() {
        Dom.removeListeners(this.listners);
    };

    Chat.prototype.save = function () {
        localStorage.setItem('chat', JSON.stringify(this.binds));
    };
    Chat.prototype.onkeyup = function (e) {
        if (e.keyCode == 13) {
            var message = this.textarea.value;
            if (message && message.trim()) {
                this.textarea.value = '';
                this.sendMessage(message);
            }
        }
    };
    Chat.prototype.sendMessage = function (message) {
        var KeyboardSetup = Engine.require('KeyboardSetup');
        if (!KeyboardSetup.isActive && message) {
            this.playGround.writeMessage(message.trim());
        }
    };
    Chat.prototype.show = function () {
        this.isHidden = false;
        Dom.removeClass(this.container, 'hidden');
    };
    Chat.prototype.hide = function () {
        this.isHidden = true;
        Dom.addClass(this.container, 'hidden');
    };
    Chat.prototype.onChatKeyup = function (e) {
        if (this.active)return;
        var me = this;
        var Controls = Engine.require('Controls');
        switch (e.keyCode) {
            case Controls.chat:
                e.preventDefault();
                e.stopPropagation();
                this.show();
                Dom.removeClass(this.textarea, 'hidden');
                setTimeout(function () {
                    me.textarea.focus()
                }, 50);
                break;
            case Controls.bind1:
            case Controls.bind2:
            case Controls.bind3:
            case Controls.bind4:
            case Controls.bind5:
            case Controls.bind6:
            case Controls.bind7:
            case Controls.bind8:
            case Controls.bind9:
                for (var bindKey in Controls) {
                    if (Controls.hasOwnProperty(bindKey) && Controls[bindKey] === e.keyCode) {
                        this.sendMessage(this.binds[bindKey]);
                        break;
                    }
                }
                break;
        }
    };
    Chat.prototype.update = function (personId, message) {
        var screen = this.screen;
        var name;
        if (personId) {
            var person = this.playGround.entities[personId];
            if (person) {
                name = person.name + " : ";
            }
        } else {
            name = Dom.el('span', "system", 'sys : ');
        }
        if (name) {
            var writer = Dom.el('span', 'writer', name);
            var messageHolder = Dom.el('span', 'message', decodeURIComponent(message));
            var comment = Dom.el('div', 'comment', [writer, messageHolder]);
            screen.appendChild(comment);
            screen.scrollTop = this.screen.scrollHeight;
        }
        if (screen.childNodes.length > 100) {
            for (var i = 20; i >= 0; i--) {
                screen.childNodes[i].remove(true);
            }
        }
    };

    return Chat;
}));