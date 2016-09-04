Engine.define('Dispatcher', ['Dom'], function () {
    
    var Dom = Engine.require('Dom');

    var regex = /(^\/)|(\/$)/;
    var Dispatcher = function(application, context, urlResolver){
        this.app = Dom.id(application);
        this.context = context;
        this.applications = {};
        this.activeApplication = null;
        this.history = history;
        this.urlResolver = urlResolver;
        var me = this;
        Dom.addListeners({onpopstate: function(){
            if(me.urlResolver) {
                var app = me.urlResolver.findApplication();
                me.placeApplication(app);
            }
        }});
        this.events = null;
    };

    Dispatcher.prototype.addListener = function(name, listner) {
        if(!listner) {
            listner = name;
            name = 'afterOpen';
        }
        switch (name) {
            case 'beforeOpen':
            case 'afterOpen':
            case 'beforeClose':
            case 'afterClose':
                break;
            default:
                throw 'Unknown event: ' + name;
        }
        if(this.events === null) {
            this.events = {};
        }
        if(!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(listner);
    };
    
    Dispatcher.prototype.initApplication = function (contructor) {
        var application;
        if(typeof contructor == "function") {
            var me = this;
            application = new contructor(this.context, function(applicationName, directives){
                me.placeApplication(applicationName, directives);
            });
        } else {
            application = contructor;
            if(application.init) {
                application.init(this.context);
            }
        }
        return application;
    };
    Dispatcher.prototype.placeApplication = function (applicationName, directives) {
        var me = this;
        var application = me.applications[applicationName];
        var callback = function(application) {
            var app = me.initApplication(application);
            if (!application) {
                throw "Undefined application " + applicationName;
            }
            if (me.activeApplication) {
                if (me.activeApplication.beforeClose) {
                    me.activeApplication.beforeClose();
                }
                me.fireEvent('beforeClose');
                me.app.innerHTML = '';
                if (me.activeApplication.afterClose) {
                    me.activeApplication.afterClose();
                }
                me.fireEvent('afterClose');
            }
            var url;
            if(app.getUrl) {
                url = app.getUrl();
            } else if (app.URL || app.url) {
                url = app.URL || app.url;
            } else {
                url = '';
            }
            var title;
            if(app.getTitle) {
                title = app.getTitle();
            } else if (app.TITLE || app.title) {
                title = app.TITLE || app.title;
            } else {
                title = '';
            }
            var path = document.location.pathname.replace(regex, '');
            if(url !== path) {
                var hash = document.location.hash;
                this.history.pushState({}, title, url + (hash ? hash : ''));
            }
            
            me.activeApplication = app;
            if (app.beforeOpen) {
                app.beforeOpen(directives);
            }
            me.fireEvent('beforeOpen');
            if(app.container) {
                me.app.appendChild(app.container);
            }
            if (app.afterOpen) {
                app.afterOpen();
            }
            me.fireEvent('afterOpen');
        };
        if(application) {
            callback(application);
        } else {
            Engine.load(applicationName, function() {
                me.applications[applicationName] = Engine.require(applicationName);
                me.placeApplication(applicationName, directives);
            })
        }
    };
    Dispatcher.prototype.fireEvent = function(eventType){
        if(this.events === null) return;
        if(!this.events[eventType])return;
        var events = this.events[eventType];
        for(var i = 0; i < events.length; i++) {
            events[i]();
        }
    }
    return Dispatcher;
});
