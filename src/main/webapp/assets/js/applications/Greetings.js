Engine.define('Greetings', ['Config', 'Dom', 'Radio', 'Text', 'Password', 'Rest', 'MainMenu'], (function () {

    var Dom = Engine.require('Dom');
    var Radio = Engine.require('Radio');
    var Text = Engine.require('Text');
    var Password = Engine.require('Password');
    var Rest = Engine.require('Rest');
    var Config = Engine.require('Config');
    var MainMenu = Engine.require('MainMenu');

    var OPTIONS = [
        {value: 'A', label: 'Short session'},
        {value: 'L', label: 'Login'},
        {value: 'R', label: 'Register'}
    ];

    var Greetings = function(context) {
        this.TITLE = 'Greetings';
        this.URL = 'greetings';
        this.context = context;
        this.container = null;
        this.config = context.config;
        this.placeApplication = function(url, directives){
            context.dispatcher.placeApplication(url, directives);
        };
        var me = this;
        var name = this.config.get('username') || '';
        var toggler = this.config.get('toggler') || 'A';
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
    Greetings.prototype.afterOpen = function() {
        if(this.config.get('logged')) {
            this.placeApplication('rooms-list');
        }
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
        var user = {username: name, password: pass};
        switch (toggler) {
            case 'L':
                this.performLogin(user);
                break;
            case 'R':
                Rest.doPost('user/create', user).then(
                    function(r){
                        if(r) {
                            me.performLogin(user);
                            me.config.set('toggler', "L");
                        } else {
                            me.showError('User with this login already registered');
                        }
                    }
                );
                break;
            default:
                this.config.set('username', name);
                this.config.set("arena_name", name);
                MainMenu.init(this.context);
                this.placeApplication('rooms-list');
        }
        this.config.set('toggler', toggler);
    };
    Greetings.prototype.performLogin = function(user) {
        var iFrameName = 'loginIframe';
        var form = Dom.el('form', {method: 'post', action: 'server/login', target: iFrameName}, [
            Dom.el('input', {name: 'username', value: user.username}),
            Dom.el('input', {name: 'password', value: user.password})
        ]);
        var me = this;
        var iFrame = Dom.el('iframe', {name: iFrameName, src:"about:blank", style: 'display: none'});
        document.body.appendChild(iFrame);
        var onLoad = {load: function(){me.readIframeResponse(this, user.username)}};
        Dom.addListeners(iFrame, onLoad);
        form.submit();
    };
    Greetings.prototype.readIframeResponse = function(iFrame, username) {
        var doc = iFrame.contentDocument || iFrame.contentWindow.document;
        var content = doc.body.innerText;
        try {
            var dto = JSON.parse(content);
            this.config.set("logged", true);
            this.config.set("username", username);
            this.config.set("arena_name", dto.arenaUserName);
            this.config.set('authority', dto.authority);
            Greetings.sessionExist = true;
            MainMenu.init(this.config, this.placeApplication);
            this.placeApplication("rooms-list");
        } catch (e){
            this.config.set("logged", false);
            this.showError("Invalid username or password");
        }
        iFrame.remove();
    };
    Greetings.prototype.showError = function(message) {
        this.errorMessage.innerText = message;
    };
    Greetings.prototype.toString = function (e) {
        return "Greetings application";
    };
    
    Greetings.isLogged = function (config, clb) {
        var isLogged = config.get('logged');
        if(isLogged) {//data from localstorage
            if(Greetings.sessionExist) {//data from current browser session
                clb(true);
            } else {
                Rest.doGet('users/is-logged').then(
                    function(response) {
                        Greetings.sessionExist = response;
                        clb(response);
                    }
                )
            }
        } else {
            Greetings.sessionExist = false;
            clb(false);
        }
    };
    Greetings.sessionExist = false;
    
    return Greetings;

}));