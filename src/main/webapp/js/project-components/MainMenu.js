Engine.define('MainMenu', ['Dom', 'StringUtils', 'UrlResolver'], function(){
    
    var Dom = Engine.require('Dom');
    var StringUtils = Engine.require('StringUtils');
    var UrlResolver = Engine.require('UrlResolver');

    var staticContainer = null;
    var staticButtons = null;

    function MainMenu(context, placeApplication) {
        this.placeApplication = placeApplication;
        if(staticContainer === null) {
            MainMenu.init(context, placeApplication);
        }
        this.container = staticContainer;
    }
    MainMenu.addButton = function (name, text) {
        if(!text)text = StringUtils.normalizeText(name);
        var isActive = name === UrlResolver.findApplication();
        var clazz = isActive ? 'active' : '';
        
        var a = Dom.el('a', {href: '#', class: clazz, onclick: function(e){
            e.preventDefault();
            MainMenu.placeApplication(name);
        }}, text);
        staticContainer.appendChild(a);
        staticButtons.push({a: a, name: name});
    };

    MainMenu.placeApplication = null;
    
    MainMenu.updateActive = function() {
        var app = UrlResolver.findApplication();
        if(!staticButtons) {
            staticButtons = [];
        }
        for (var i = 0; i < staticButtons.length; i++) {
            var button = staticButtons[i];
            var a = button.a;
            var name = button.name;
            if (app === name) {
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
    MainMenu.init = function(context, placeApplication) {
        MainMenu.placeApplication = placeApplication;
        staticContainer = Dom.el('div', 'main-menu');
        staticButtons = [];
        MainMenu.addButton('RoomsList');
        MainMenu.addButton('MapList');
        MainMenu.addButton('MapEditor');
        if (context.get('logged')) {
            MainMenu.addButton('Account');
            MainMenu.addButton('Logout');
        } else {
            MainMenu.addButton('Greetings', 'Login');
        }
    };

    return MainMenu;
    
});