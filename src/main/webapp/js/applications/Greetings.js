Engine.define('Greetings', (function () {

    var Dom = Engine.require('Dom');
    var Dispatcher = Engine.require('Dispatcher');
    
    var Greetings = function() {
        this.container = null;
        this.name = null;
    };
    Greetings.prototype.init = function () {
        var me = this;
        var name = localStorage.getItem('personName') || '';
        this.name = Dom.el('input', {name: 'name', type: 'text', placeholder: 'Your name', value: name});
        var submit = Dom.el('input', {type: 'submit', value: 'Ready to kill'});
        var form = Dom.el('form', {onsubmit: function(event){me.onSubmit(event)}}, [me.name, submit]);
        var window = Dom.el('div', {'class': 'window'}, [
            Dom.el('h1', null, 'Kill Them All'),
            form,
            Dom.el('p', null, 'Online browser game. No registration, just fun')]);
        this.container = Dom.el('div', {'class': 'overlay'}, window);
    };
    Greetings.prototype.getName = function () {
        return this.name.value;
    };
    Greetings.prototype.onSubmit = function (e) {
        e.preventDefault();
        var PlayGround = Engine.require('PlayGround');
        var name = this.getName();
        localStorage.setItem('personName', name);
        PlayGround.playerName = name;
        Dispatcher.placeApplication('RoomsList');
        return false;
    };
    return Greetings;

})());