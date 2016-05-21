var KeyboardSetup = {
    container: null,
    isActive: false,
    show: function() {
        KeyboardSetup.isActive = true;
        Dom.removeClass(KeyboardSetup.container, 'hidden');
    },
    hide: function() {
        KeyboardSetup.isActive = false;
        Dom.addClass(KeyboardSetup.container, 'hidden');
    },
    init: function() {
        var title = Dom.el('h3', null, 'Keyboard settings');
        var buttons = KeyboardSetup.buildButtons();
        window.addEventListener('keyup', KeyboardSetup.onEscapeButton, false);
        KeyboardSetup.container = Dom.el('div', {class: 'keyboard-setup hidden'}, [title, buttons]);
    },
    onEscapeButton: function(e) {
        console.log("button pressed: " + e.keyCode);
        if(KeyboardSetup.isActive && e.keyCode === 27) {
            KeyboardSetup.hide();
        }
    },
    buildButtons: function() {
        var buttons = [];
        for(var key in Controls) {
            buttons.push(KeyboardSetup.createInput(key));
        }
        var esc = Dom.el('input', {type: 'button', value: 'Close'});
        esc.onclick = KeyboardSetup.hide;
        buttons.push(esc);
        return Dom.el('div', 'controls', buttons);
    },
    createInput: function(key) {
        var id = "control_" + key;
        var input = Dom.el('input', {id: id, type:'text', value: String.fromCharCode(Controls[key])});
        input.onkeyup = function(e) {
            var value = String.fromCharCode(e.keyCode);
            if(value) {
                this.value = value;
                Controls[key] = e.keyCode;
            } else {
                this.value = Controls[key];
            }
        };
        var label = Dom.el('label', {'for': id}, key);
        return Dom.el('div', null, [label, input]);
    }
};