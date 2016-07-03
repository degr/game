var Chat = {
    container: null,
    isTextareaShown: false,
    screen: null,
    textarea: null,
    active: null,
    isHidden: false,
    binds: {},
    wasMoved: false,
    init: function () {
        window.addEventListener('keyup', Chat.onChatKeyup, false);
        try {
            var value = localStorage.getItem('chat');
            if(value) {
                Chat.binds = JSON.parse(value);
            }
        } catch (e){
            Chat.binds = {};
        }
        Chat.textarea = Dom.el('textarea', Chat.isTextareaShown ? '' : 'hidden');
        Chat.textarea.onkeyup = Chat.onkeyup;
        Chat.textarea.onfocus = function () {
            Chat.active = true;
            Chat.isTextareaShown = true;
            PersonActions.stopFire()
        };
        Chat.textarea.onblur = function () {
            Chat.active = false;
            Chat.isTextareaShown = false;
            Dom.addClass(Chat.textarea, 'hidden');
        };
        Chat.screen = Dom.el('div', 'console');
        Chat.container = Dom.el('div', 'chat', [Chat.screen, Chat.textarea]);
        var onClick = function(e){
            //e.preventDefault();
            e.stopPropagation();
            e.preventBubble = true;
        };
        var container = Chat.container;
        container.onclick = onClick;
        container.onmousedown = onClick;
        container.onmouseup = onClick;
        Chat.screen.onmouseover = function (e) {
            if (!Chat.active) {
                e.preventDefault();
                if (Chat.wasMoved) {
                    container.style.left = '66px';
                    container.style.right = 'auto';
                } else {
                    container.style.left = 'auto';
                    container.style.right = '66px';
                }
                Chat.wasMoved = !Chat.wasMoved;
            }
        };
    },
    save: function() {
        localStorage.setItem('chat', JSON.stringify(Chat.binds));
    },
    onkeyup: function(e) {
        if(e.keyCode == 13) {
            var message = Chat.textarea.value;
            if(message && message.trim()) {
                Chat.textarea.value = '';
                Chat.sendMessage(message);
            }
        }
    },
    sendMessage: function(message) {
        if(!KeyboardSetup.isActive && message) {
            PlayGround.writeMessage(message.trim());
        }
    },
    show: function() {
        Chat.isHidden = false;
        Dom.removeClass(Chat.container, 'hidden');
    },
    hide: function() {
        Chat.isHidden = true;
        Dom.addClass(Chat.container, 'hidden');
    },
    onChatKeyup: function(e) {
        if(Chat.active)return;
        switch (e.keyCode) {
            case Controls.chat: 
                e.preventDefault();
                e.stopPropagation();
                Chat.show();
                Dom.removeClass(Chat.textarea, 'hidden');
                setTimeout(function(){
                    Chat.textarea.focus()
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
                for(var bindKey in Controls) {
                    if(Controls[bindKey] === e.keyCode) {
                        Chat.sendMessage(Chat.binds[bindKey]);
                        break;
                    }
                }
                break;
        }
    },
    update: function(personId, message) {
        var screen = Chat.screen;
        var name;
        if(personId) {
            var person = PlayGround.entities[personId];
            if(person) {
                name = person.name + " : ";
            }
        } else {
            name = Dom.el('span', "system", 'sys : ');
        }
        if(name) {
            var writer = Dom.el('span', 'writer', name);
            var messageHolder = Dom.el('span', 'message', decodeURIComponent(message));
            var comment = Dom.el('div', 'comment', [writer, messageHolder]);
            screen.appendChild(comment);
            screen.scrollTop =  Chat.screen.scrollHeight;
        }
        if(screen.childNodes.length > 100) {
            for(var i = 20; i >= 0; i--) {
                screen.childNodes[i].remove(true);
            }
        }
    }
};