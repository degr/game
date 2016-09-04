Engine.define("Context", (function () {
    function Context(contextName) {
        this.contextName = contextName;
        try {
            this.storage = JSON.parse(localStorage.getItem(contextName));
        } catch (e) {
            this.storage = null;
        }
        if (this.storage == null) {
            this.storage = {};
        }
    }
    Context.prototype.get = function (name) {
        return this.storage[name];
    };
    Context.prototype.has = function(name) {
        return this.get(name) === undefined;
    };
    Context.prototype.set = function (name, value) {
        this.storage[name] = value;
        localStorage.setItem(this.contextName, JSON.stringify(this.storage));
    };
    Context.prototype.remove = function (name) {
        delete(this.storage[name]);
        localStorage.setItem(this.contextName, JSON.stringify(this.storage));
    };
    Context.prototype.toString = function() {
        return 'Context instance';
    };
    return Context;
}));