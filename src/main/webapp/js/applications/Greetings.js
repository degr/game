Engine.define('Greetings', ['Dom', 'Radio', 'Text', 'Password', 'Rest'], (function () {

    var Dom = Engine.require('Dom');
    var Radio = Engine.require('Radio');
    var Text = Engine.require('Text');
    var Password = Engine.require('Password');
    var Rest = Engine.require('Rest');

    var OPTIONS = [
        {value: 'A', label: 'Short session'},
        {value: 'L', label: 'Login'},
        {value: 'R', label: 'Register'}
    ];
    
    /**
     * @param context Context
     * @param placeApplication function
     * @constructor
     */
    var Greetings = function(context, placeApplication) {

        this.TITLE = 'Greetings';
        this.URL = 'greetings';
        
        this.container = null;
        this.context = context;
        this.placeApplication = placeApplication;
        var me = this;
        var name = this.context.get('personName') || '';
        var toggler = this.context.get('toggler') || 'A';
        this.errorMessage = Dom.el('div', 'error');
        this.name = new Text({noLabel: true, name: 'name', attr: {placeholder: 'Your name'}, value: name});
        this.password = new Password({noLabel: true, type: 'password',
            class: toggler === 'A' ? 'hidden' : '', name: 'name', attr: {placeholder: 'Your password'}, value: ''});
        this.toggler = new Radio({name: 'toggler', onclick: function(e){me.togglePassword(e)}, noLabel: true, value: toggler, options: OPTIONS});
        this.emailNotification = Dom.el('div', 'formfield-holder ' + (toggler === 'R' ? '' : 'hidden'), 'If you will type email, you will be able to restore your password');
        
        var submit = Dom.el('input', {type: 'submit', value: 'Ready to kill'});
        var form = Dom.el(
            'form',
            {onsubmit: function(event){me.onSubmit(event)}},
            [
                this.toggler.container,
                this.errorMessage,
                this.emailNotification,
                me.name.container,
                this.password.container,
                submit
            ]
        );
        var win = Dom.el('div', {'class': 'window'}, [
            Dom.el('h1', null, 'Kill Them All'),
            form,
            Dom.el('p', null, 'Online browser game. No registration, just fun')]);
        this.container = Dom.el('div', {'class': 'overlay'}, win);
    };
    Greetings.prototype.getName = function () {
        return this.name.getValue();
    };

    Greetings.prototype.togglePassword = function(e) {
        var value = e.target.value;
        this.showError("");
        if(value === 'A') {
            Dom.addClass(this.password.container, 'hidden');
        } else {
            Dom.removeClass(this.password.container, 'hidden');
        }
        if(value === 'R') {
            Dom.removeClass(this.emailNotification, 'hidden');
        } else {
            Dom.addClass(this.emailNotification, 'hidden');
        }
    };
    Greetings.prototype.getPassword = function (e) {
        return this.password.getValue();
    };
    Greetings.prototype.onSubmit = function (e) {
        e.preventDefault();
        var name = this.getName();
        var pass = this.getPassword();
        var toggler = this.toggler.getValue();
        var me = this;
        switch (toggler) {
            case 'L':
                Rest.doPost('user/login', {username: name, password: pass}).then(
                    function(r){
                        me.onLoginCheck(r);
                    }
                );
                break;
            case 'R':
                Rest.doPost('user/create', {username: name, password: pass}).then(
                    function(r){
                        if(r.success) {
                            me.onLoginCheck(r.userId);
                        } else {
                            me.showError('User with this login already registered');
                        }
                    }
                );
                break;
            default:
                this.placeApplication('RoomsList');
                this.context.set('personName', name);
        }
        this.context.set('toggler', toggler);
    };
    Greetings.prototype.onLoginCheck = function(userId) {
        if(userId) {
            this.context.set('userId', userId);
            this.placeApplication('RoomsList');
        } else {
            this.showError('Invalid username or password!');
        }
    };
    Greetings.prototype.showError = function(message) {
        this.errorMessage.innerText = message;
    };
    Greetings.prototype.toString = function (e) {
        return "Greetings application";
    };
    return Greetings;

}));