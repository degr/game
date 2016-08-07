Engine.define('Greetings', (function () {

    var Dom = Engine.require('Dom');

    /**
     * @param dispatcher Dispatcher
     * @param playground Playground
     * @constructor
     */
    var Greetings = function(dispatcher, playground) {
        if(!dispatcher) {
            throw "Greetings class require dispatcher instance";
        }
        if(!playground) {
            throw "Greetings class require playground instance";
        }
        
        this.playGround = playground;
        this.container = null;
        this.name = null;
        this.dispatcher = dispatcher;
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
        var name = this.getName();
        localStorage.setItem('personName', name);
        this.playGround.playerName = name;
        this.dispatcher.placeApplication('RoomsList');
        return false;
    };
    return Greetings;

})());