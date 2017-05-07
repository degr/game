Engine.define('MainMenu', ['Dom', 'StringUtils'], function(){
    
    var Dom = Engine.require('Dom');
    var StringUtils = Engine.require('StringUtils');

    var staticContainer = null;
    var staticButtons = null;

    function MainMenu(context) {
        var placeApplication = function(url, directives){
            context.dispatcher.placeApplication(url, directives);
        };
        this.placeApplication = placeApplication;
        if(staticContainer === null) {
            MainMenu.init(context, placeApplication);
        }
        this.container = staticContainer;
    }
    MainMenu.addButton = function (name, text) {
        if(!text)text = StringUtils.normalizeText(name);
        var isActive = false;//@TODO name === UrlResolver.findApplication();
        var clazz = isActive ? 'active' : '';
        
        var a = Dom.el('a', {href: '#', class: clazz, onclick: function(e){
            e.preventDefault();
            MainMenu.placeApplication(name);
            for(var i = 0; i < staticButtons.length; i++) {
                var button = staticButtons[i];
                button.a.className = '';
            }
            a.className = "active";
        }}, text);
        staticContainer.appendChild(a);
        staticButtons.push({a: a, name: name});
    };

    MainMenu.placeApplication = null;
    
    MainMenu.updateActive = function(pass) {
        if(pass !== 13)return;
        var app = UrlResolver.resolve();
        if(!staticButtons) {
            staticButtons = [];
        }
        for (var i = 0; i < staticButtons.length; i++) {
            var button = staticButtons[i];
            var a = button.a;
            var name = button.name;
            if (app.url === name) {
                if (a.className != 'active') {
                    a.className = 'active';
                }
            } else {
                if (a.className) {
                    a.className = '';
                }
            }
        }
    };
    MainMenu.init = function(context) {
        MainMenu.placeApplication = function(url, directives) {
            context.dispatcher.placeApplication(url, directives);
        };
        staticContainer = Dom.el('div', 'main-menu');
        staticButtons = [];
        MainMenu.addButton('rooms-list', "Join Game");
        staticButtons[0].a.className = 'active';
        MainMenu.addButton('map-list', "Create Game");
        MainMenu.addButton('map-editor');
        if (context.config.get('logged')) {
            MainMenu.addButton('account');
            MainMenu.addButton('logout');
            if(context.config.get('authority') === 'ROLE_ADMIN') {
                MainMenu.addButton('users');
                MainMenu.addButton('maps');
                MainMenu.addButton('tiles');
            }
        } else {
            MainMenu.addButton('greetings', 'Login');
        }
    };

    return MainMenu;
    
});