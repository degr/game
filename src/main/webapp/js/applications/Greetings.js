Engine.define('Greetings', (function () {

    var Dom = Engine.require('Dom');

    /**
     * @param context Context
     * @param placeApplication function
     * @constructor
     */
    var Greetings = function(context, placeApplication) {
        this.container = null;
        this.name = null;
        this.context = context;
        this.placeApplication = placeApplication;
    };
    Greetings.prototype.init = function () {
        var me = this;
        var name = this.context.get('personName') || '';
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
        this.context.set('personName', name);
        this.placeApplication('RoomsList');
    };
    Greetings.prototype.toString = function (e) {
        return "Greetings application";
    };
    return Greetings;

})());