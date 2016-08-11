var Engine = {
    modules: {},
    define: function(name, module) {
        if(Engine.modules[name]) {
            throw "Module with name '"+ name + "' already exist"
        }
        Engine.modules[name] = module;
    },
    require: function (name) {
        if(Engine.modules[name] === undefined) {
            throw "Module not instantiated " + name;
        } else {
            return Engine.modules[name];
        }
    }
};