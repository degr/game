Engine.define('Dispatcher', (function () {

    var Dom = Engine.require('Dom');

    var Dispatcher = {
        appStore: null,
        app: null,
        applications: {},
        activeApplication: null
    };
    
    Dispatcher.init = function () {
        Dispatcher.appStore = Dom.id('appstore');
        Dispatcher.app = Dom.id('application');
    };
    Dispatcher.initApplication = function (application, name) {
        if(typeof application == "function") {
            application = new application();
        }
        application.init();
        if (!Dispatcher.applications[name]) {
            Dispatcher.applications[name] = application;
        } else {
            throw 'Application with name ' + name + " already was initialized";
        }
        Dispatcher.appStore.appendChild(application.container);
    };
    Dispatcher.placeApplication = function (applicationName) {
        var application = Dispatcher.applications[applicationName];
        if (!application) {
            throw "Undefined application " + applicationName;
        }
        if (Dispatcher.activeApplication) {
            if (Dispatcher.activeApplication.beforeClose) {
                Dispatcher.activeApplication.beforeClose();
            }
            Dispatcher.appStore.appendChild(Dispatcher.activeApplication.container);
            if (Dispatcher.activeApplication.afterClose) {
                Dispatcher.activeApplication.afterClose();
            }
        }
        Dispatcher.activeApplication = application;
        if (application.beforeOpen) {
            application.beforeOpen();
        }
        Dispatcher.app.appendChild(application.container);
        if (application.afterOpen) {
            application.afterOpen();
        }
    };
    return Dispatcher;
})());
