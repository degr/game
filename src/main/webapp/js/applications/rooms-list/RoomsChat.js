var RoomsChat = {
    container: null,
    textarea: null,
    screen: null,
    isActive: false,
    messages: [],
    wasScrolled: false,
    scrollActive: false,
    setActive: function(active) {
        RoomsChat.isActive = active;
    },
    init: function() {
        RoomsChat.screen = Dom.el('div', 'messages');
        screen.onscroll = function() {
            if(!RoomsChat.scrollActive) {
                RoomsChat.wasScrolled = true
            } else {
                RoomsChat.scrollActive = false;
            }
        }
        RoomsChat.textarea = Dom.el('textarea');
        RoomsChat.textarea.onkeyup = function(e){RoomsChat.onKeyUp(e)};
        var button = Dom.el('input', {type: "submit", value: 'Send message (256 chars max)'});
        var terminal = Dom.el('form', {'class': 'terminal'}, [
            RoomsChat.textarea,
            button
        ]);
        terminal.onsubmit = function(e) {
            e.preventDefault();
            RoomsChat.sendMessage();
        };
        RoomsChat.container = Dom.el('div', 'room-list-chat panel', [RoomsChat.screen, terminal]);
        DomComponents.doModal(RoomsChat.container);
        setInterval(function(){
            RoomsChat.onUpdate();
        }, 3000);
    },
    onKeyUp: function(e) {
        if(e.keyCode == 13) {
            RoomsChat.sendMessage();
            console.log(e);
        }
    },
    sendMessage: function() {
        var message = RoomsChat.textarea.value.trim();
        if(message) {
            RoomsChat.textarea.value = '';
            Rest.doPost('chat/put', {message: message, sender: Greetings.getName()}).then(
                function(response) {
                    RoomsChat.updateChat(response)
                }
            );
        }
    },
    onUpdate: function() {
        if(RoomsChat.isActive) {
            Rest.doGet('chat/get').then(function (response) {
                RoomsChat.updateChat(response)
            });
        }
    },
    updateChat: function(response) {
        if(response && response.length) {
            for(var i = 0; i < response.length; i++) {
                var message = response[i];
                if(RoomsChat.messages.indexOf(message.id) == -1) {
                    RoomsChat.messages.push(message.id);
                    var date = new Date(message.timestamp);
                    var time = date.getHours() + ":" + date.getMinutes() + ":"+ date.getSeconds();
                    if(message.message.length > 256) {
                        message.message = message.message.substring(0, 253) + "...";
                    }
                    RoomsChat.screen.appendChild(Dom.el('div', 'message',[
                        Dom.el('span', 'gray', time + " " +message.sender + " : "), message.message]))
                }
            }
            if(!RoomsChat.wasScrolled) {
                RoomsChat.scrollActive = true;
                RoomsChat.screen.scrollTop = RoomsChat.screen.scrollHeight;
            }
        }
    }
}
