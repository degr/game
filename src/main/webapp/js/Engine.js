var Engine = {
    modules: {},
    pathBuilder: null,
    afterModuleLoad: {},
    loaded: {},
    limit: 500,
    log: true,
    load: function(module, clb) {
        if(Engine.modules[module]) {
            clb();
        } else {
            if(!Engine.afterModuleLoad[module]) {
                Engine.afterModuleLoad[module] = [];
            }
            Engine.afterModuleLoad[module].push(clb);
            Engine._load(module);
        }
    },
    _load: function(module, clb) {
        var path;
        if (Engine.pathBuilder !== null) {
            path = Engine.pathBuilder(module);
        } else {
            path = "js/" + module + ".js";
        }
        if(!path) {
            throw "Can't load module " + module + " because path is undefined ";
        } else {
            Engine.console('Resolving dependency: ' + module + " using path: " + path);
            var script = document.createElement('script');
            script.onload = clb;
            script.src = path;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },
    define: function(name, imports, module) {
        if(!module) {
            //module have no dependencies, can be initialized by default
            Engine._initModule(name, imports, []);
            return;
        } else if(!imports) {
            imports = [];
        }
        var i;
        var requirements = [];
        if(imports) {
            if(typeof imports === 'string') {
                if(!Engine.modules[imports]) {
                    requirements.push(imports);
                }
            } else {
                for (i = 0; i < imports.length; i++) {
                    if (Engine.modules[imports[i]] === undefined) {
                        requirements.push(imports[i]);
                    }
                }
            }
        }
        if(requirements.length > 0) {
            var clb = function(){
                Engine.define(name, imports, module);
            };
            clb.toString = function() {
                return "Callback for " + name + " when all dependencies resolved";
            };
            Engine._loadClasses(name, requirements, clb);
        } else {
            var args = [];
            if(imports) {
                if(typeof imports === 'string') {
                    args = [Engine.require(imports)];
                } else {
                    for (i = 0; i < imports.length; i++) {
                        args.push(Engine.require(imports[i]));
                    }
                }
            }
            Engine._initModule(name, module, args);
        }
    },
    require: function (name) {
        if(Engine.modules[name] === undefined) {
            throw "Module not instantiated " + name;
        } else {
            return Engine.modules[name];
        }
    },
    _initModule: function (name, module, arguments) {
        if(typeof module === 'function') {
            Engine.modules[name] = module.apply(window, arguments);
        } else {
            Engine.modules[name] = module;
        }
        if(Engine.loaded[name] && Engine.loaded[name].deferredCallbacks) {
            for (var i = Engine.loaded[name].deferredCallbacks.length -1; i >= 0; i--) {
                //after this deferred callbacks queue must be cleaned
                (Engine.loaded[name].deferredCallbacks.pop())();
            }
        }
        if(Engine.afterModuleLoad[name]) {
            for(var j = 0; j < Engine.afterModuleLoad[name].length; j++) {
                (Engine.afterModuleLoad[name].pop())();
            }
        }
    },
    _loadClasses: function(parentName, requirements, callback) {
        Engine.console('resolve dependencies for ' + parentName);
        Engine.limit--;
        if(Engine.limit < 1) {
            if(Engine.limit < 1) {
                throw "Something wrong!";
            }
        }
        if(requirements.length === 0) {
            callback();
        } else {
            var module = requirements.pop();
            var dependencyCallback = function(){
                Engine._loadClasses(parentName, requirements, callback);
            };
            dependencyCallback.toString = function() {
                return "Callback for " + parentName;
            };
            
            if(!Engine.loaded[module]) {
                Engine.loaded[module] = {
                    afterLoad: dependencyCallback,
                    callers: [],
                    deferredCallbacks:  []
                };
                Engine._load(module, function () {
                    Engine.console("Script " + module + " was loaded as dependency for: " + parentName);
                    Engine.loaded[module].afterLoad();
                });

            } else if(Engine.modules[module]){
                Engine.console('Dependency ' + module + ' already loaded');
                dependencyCallback();
            } else if(Engine.loaded[module].callers.indexOf(parentName) === -1) {
                Engine.loaded[module].callers.push(parentName);
                Engine.loaded[module].deferredCallbacks.push(dependencyCallback);
            } else {
                Engine.console("Skipped dependency " + module + " load for " + parentName);
            }
        }
    },
    console: function(message){
        if(Engine.log) {
            console.log(message);
        }
    }
};