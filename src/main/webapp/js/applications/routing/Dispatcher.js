Engine.define('Dispatcher', ['Dom'], function () {
    
    var Dom = Engine.require('Dom');
    
    var Dispatcher = function(application, context){
        this.app = Dom.id(application);
        this.context = context;
        this.applications = {};
        this.activeApplication = null;
        this.history = history;
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
                me.app.innerHTML = '';
                if (me.activeApplication.afterClose) {
                    me.activeApplication.afterClose();
                }
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
            var hash = document.location.hash;
            this.history.pushState({}, title, url + (hash ? hash : ''));
            
            me.activeApplication = app;
            if (app.beforeOpen) {
                app.beforeOpen(directives);
            }
            me.app.appendChild(app.container);
            if (app.afterOpen) {
                app.afterOpen();
            }
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
    return Dispatcher;
});
