var Chat = {
    container: null,
    screen: null,
    textarea: null,
    active: null,
    isHidden: false,
    init: function () {
        Chat.textarea = Dom.el('textarea');
        Chat.textarea.onkeydown = Chat.onkeyup;
        Chat.textarea.onfocus = function () {Chat.active = true;PersonActions.stopFire()};
        Chat.textarea.onblur = function () {Chat.active = false;};
        Chat.screen = Dom.el('div', 'console');
        Chat.container = Dom.el('div', 'chat', [Chat.screen, Chat.textarea]);
    },
    onkeyup: function(e) {
        if(e.keyCode == 13) {
            var message = Chat.textarea.value;
            Chat.textarea.value = '';
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
    update: function(personId, message) {
        if(PlayGround.entities[personId]) {
            var writer = Dom.el('span', 'writer', PlayGround.entities[personId].name + " : ");
            var messageHolder = Dom.el('span', 'message', message);
            var comment = Dom.el('div', 'comment', [writer, messageHolder]);
            Chat.screen.appendChild(comment);
            Chat.screen.scrollTop =  Chat.screen.scrollHeight;
        }
    }
};