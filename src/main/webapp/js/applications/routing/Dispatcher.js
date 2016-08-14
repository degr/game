Engine.define('Dispatcher', (function () {

    var Dom = Engine.require('Dom');

    var Dispatcher = function(appstore, application, context){
        this.appStore = Dom.id(appstore);
        this.app = Dom.id(application);
        this.context = context;
        this.applications = {};
        this.activeApplication = null;
    };
    
    Dispatcher.prototype.initApplication = function (contructor, name) {
        var application;
        if(typeof contructor == "function") {
            var me = this;
            application = new contructor(this.context, function(applicationName, directives){
                me.placeApplication(applicationName, directives);
            });
        } else {
            application = contructor;
        }
        if(application.init) {
            application.init(this.context);
        }
        if (!this.applications[name]) {
            this.applications[name] = application;
        } else {
            throw 'Application with name ' + name + " already was initialized";
        }
        this.appStore.appendChild(application.container);
    };
    Dispatcher.prototype.placeApplication = function (applicationName, directives) {
        var application = this.applications[applicationName];
        if (!application) {
            throw "Undefined application " + applicationName;
        }
        if (this.activeApplication) {
            if (this.activeApplication.beforeClose) {
                this.activeApplication.beforeClose();
            }
            this.appStore.appendChild(this.activeApplication.container);
            if (this.activeApplication.afterClose) {
                this.activeApplication.afterClose();
            }
        }
        this.activeApplication = application;
        if (application.beforeOpen) {
            application.beforeOpen(directives);
        }
        this.app.appendChild(application.container);
        if (application.afterOpen) {
            application.afterOpen();
        }
    };
    return Dispatcher;
})());
