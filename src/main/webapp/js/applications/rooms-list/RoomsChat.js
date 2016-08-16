Engine.define(
    'RoomsChat',
    ['Dom', 'DomComponents', 'Rest', 'Greetings', 'Context'],
    function(Dom, DomComponents, Rest, Greetings, Context) {
    
    function RoomsChat(context) {
        if(!(context instanceof Context)) {
            throw "Rooms chat require Context instance";
        }
        this.container = null;
        this.textarea = Dom.el('textarea');
        this.screen = Dom.el('div', 'messages');
        this.messages = [];
        this.wasScrolled = false;
        this.scrollActive = false;
        this.interval = null;
        /**
         * @var context Context
         */
        this.context = context;

        var me = this;
        this.screen.onscroll = function () {
            if (!me.scrollActive) {
                me.wasScrolled = true
            } else {
                me.scrollActive = false;
            }
        };
        this.textarea.onkeyup = function (e) {
            me.onKeyUp(e)
        };
        var button = Dom.el('input', {type: "submit", value: 'Send message (256 chars max)'});
        var terminal = Dom.el('form', {'class': 'terminal'}, [
            this.textarea,
            button
        ]);
        terminal.onsubmit = function (e) {
            e.preventDefault();
            me.sendMessage();
        };
        this.container = Dom.el('div', 'room-list-chat panel', [this.screen, terminal]);
        DomComponents.doModal(this.container);
    }
    RoomsChat.prototype.onKeyUp = function (e) {
        if (e.keyCode == 13) {
            this.sendMessage();
        }
    };
    RoomsChat.prototype.sendMessage = function () {
        var message = this.textarea.value.trim();
        if (message) {
            this.textarea.value = '';
            var me = this;
            Rest.doPost('chat/put', {
                message: message,
                sender: me.context.get('personName')
            }).then(
                function (response) {
                    me.updateChat(response)
                }
            );
        }
    };
    RoomsChat.prototype.onUpdate = function () {
        var me = this;
        Rest.doGet('chat/get').then(function (response) {
            me.updateChat(response)
        });
    };
    RoomsChat.prototype.updateChat = function (response) {
        if (response && response.length) {
            for (var i = 0; i < response.length; i++) {
                var message = response[i];
                if (this.messages.indexOf(message.id) == -1) {
                    this.messages.push(message.id);
                    var date = new Date(message.timestamp);
                    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    if (message.message.length > 256) {
                        message.message = message.message.substring(0, 253) + "...";
                    }
                    this.screen.appendChild(Dom.el('div', 'message', [
                        Dom.el('span', 'gray', time + " " + message.sender + " : "), message.message]))
                }
            }
            if (!this.wasScrolled) {
                this.scrollActive = true;
                this.screen.scrollTop = this.screen.scrollHeight;
            }
        }
    };


    RoomsChat.prototype.stop = function () {
        clearInterval(this.interval);
    };
    RoomsChat.prototype.start = function () {
        var me = this;
        this.interval = setInterval(function () {
            me.onUpdate();
        }, 3000);
    };

    return RoomsChat;
});