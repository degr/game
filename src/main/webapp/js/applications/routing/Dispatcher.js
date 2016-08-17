Engine.define('Dispatcher', ['Dom'], (function (Dom) {
    
    var Dispatcher = function(application, context){
        this.app = Dom.id(application);
        this.context = context;
        this.applications = {};
        this.activeApplication = null;
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
}));
