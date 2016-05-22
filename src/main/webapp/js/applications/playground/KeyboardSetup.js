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
        console.log("button pressed: " + e.keyCode + " " + String.fromCharCode(e.keyCode));
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
        var input = Dom.el('input', {id: id, type:'text', value: KeyboardSetup.translateButton(Controls[key])});
        input.onkeyup = function(e) {
            var value = KeyboardSetup.translateButton(e.keyCode);
            if(value === 'esc') {
                return;
            }
            if(value) {
                this.value = value;
                Controls[key] = e.keyCode;
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