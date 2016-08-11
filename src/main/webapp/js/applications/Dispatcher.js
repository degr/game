Engine.define('Dispatcher', (function () {

    var Dom = Engine.require('Dom');

    var Dispatcher = function(appstore, application){
        this.appStore = Dom.id(appstore);
        this.app = Dom.id(application);
        this.applications = {};
        this.activeApplication = null;
    };
    
    Dispatcher.prototype.initApplication = function (contructor, name) {
        var application;
        if(typeof application == "function") {
            application = new contructor();
        } else {
            application = contructor;
        }
        if(application.init) {
            application.init();
        }
        if (!this.applications[name]) {
            this.applications[name] = application;
        } else {
            throw 'Application with name ' + name + " already was initialized";
        }
        this.appStore.appendChild(application.container);
    };
    Dispatcher.prototype.placeApplication = function (applicationName) {
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
            application.beforeOpen();
        }
        this.app.appendChild(application.container);
        if (application.afterOpen) {
            application.afterOpen();
        }
    };
    return Dispatcher;
})());
