var Engine = (function(){

    var modules = {};
    var afterModuleLoad = {};
    var loaded = {};

    function Notification(message, type, time) {
        if(!document.body) {
            console.log(message);
            return;
        }
        if(!type)type = 'S';
        if(!time)time = 3000;
        var container = document.createElement('div');
        var style = "padding:10px;margin:5px;border-radius: 3px;";
        switch (type) {
            case 'S':
                style += 'color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6;';
                break;
            case 'I':
                style += 'color: #31708f;background-color: #d9edf7;border-color: #9acfea;';
                break;
            case 'W':
                style += 'color: #8a6d3b;background-color: #fcf8e3;border-color: #f5e79e;';
                break;
            case 'E':
                style += 'color:#a94442;background-color:#f2dede;border-color:#ebccd1;';
                break;
            default:
                throw 'Undefined message type: ' + type;
        }
        container.setAttribute('style', style);
        container.innerHTML = message;
        Notification.container.appendChild(container);
        if(Notification.container.parentNode == null) {
            document.body.appendChild(Notification.container);
        }
        setTimeout(function(){
            container.remove();
            if(Notification.container.innerHTML === '') {
                Notification.container.remove();
            }
        }, time)
    }
    Notification.container = document.createElement('div');
    Notification.container.setAttribute('style', 'position: fixed; right: 0; top: 0; width: 200px;');


    var Engine = {
        pathBuilder: null,
        limit: 500,
        log: true,
        modules: {},
        load: function (module, clb) {
            if (modules[module]) {
                clb();
            } else {
                if (!afterModuleLoad[module]) {
                    afterModuleLoad[module] = [];
                }
                afterModuleLoad[module].push(clb);
                _load(module);
            }
        },
        define: function (name, imports, module) {
            if (!module) {
                //module have no dependencies, can be initialized by default
                _initModule(name, imports, []);
                return;
            } else if (!imports) {
                imports = [];
            }
            var i;
            var requirements = [];
            if (imports) {
                if (typeof imports === 'string') {
                    if (!modules[imports]) {
                        requirements.push(imports);
                    }
                } else {
                    for (i = 0; i < imports.length; i++) {
                        if (modules[imports[i]] === undefined) {
                            requirements.push(imports[i]);
                        }
                    }
                }
            }
            if (requirements.length > 0) {
                var clb = function () {
                    Engine.define(name, imports, module);
                };
                clb.toString = function () {
                    return "Callback for " + name + " when all dependencies resolved";
                };
                _loadClasses(name, requirements, clb);
            } else {
                var args = [];
                if (imports) {
                    if (typeof imports === 'string') {
                        args = [Engine.require(imports)];
                    } else {
                        for (i = 0; i < imports.length; i++) {
                            args.push(Engine.require(imports[i]));
                        }
                    }
                }
                _initModule(name, module, args);
            }
        },
        require: function (name) {
            if (modules[name] === undefined) {
                throw "Module not instantiated " + name;
            } else {
                return modules[name];
            }
        },
        notify: function (message, type, time) {
            new Notification(message, type, time);
        },
        findPath: function(module) {
            var out;
            if(typeof Engine.pathBuilder === 'function') {
                out = Engine.pathBuilder(module);
                if(out) {
                    return out;
                }
            } else {
                for (var i = 0; i < Engine.pathBuilder.length; i++) {
                    var pathBuilder = Engine.pathBuilder[i];
                    out = pathBuilder.buildPath(module);
                    if (out) {
                        return out;
                    }
                }
            }
            throw "Can't find module " + module;
        }
    };


    function _load(module, clb) {
        var path;
        if (Engine.pathBuilder !== null) {
            path = Engine.findPath(module);
        } else {
            path = "assets/js/" + module + ".js";
        }
        if (!path) {
            throw "Can't load module " + module + " because path is undefined ";
        } else {
            var script = document.createElement('script');
            script.onload = clb;
            script.src = path;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }

    function _initModule (name, module, arguments) {
        if (typeof module === 'function') {
            modules[name] = module.apply(window, arguments);
        } else {
            modules[name] = module;
        }
        if (loaded[name] && loaded[name].deferredCallbacks) {
            for (var i = loaded[name].deferredCallbacks.length - 1; i >= 0; i--) {
                //after this deferred callbacks queue must be cleaned
                (loaded[name].deferredCallbacks.pop())();
            }
        }
        if (afterModuleLoad[name]) {
            for (var j = 0; j < afterModuleLoad[name].length; j++) {
                (afterModuleLoad[name].pop())();
            }
        }
    }
    function _loadClasses (parentName, requirements, callback) {
        Engine.limit--;
        if (Engine.limit < 1) {
            throw "Something wrong, too much modules in project! It look like circular dependency. Othervise, please change Engine.limit property";
        }
        if (requirements.length === 0) {
            callback();
        } else {
            var module = requirements.pop();
            var dependencyCallback = function () {
                _loadClasses(parentName, requirements, callback);
            };
            dependencyCallback.toString = function () {
                return "Callback for " + parentName;
            };

            if (!loaded[module]) {
                loaded[module] = {
                    afterLoad: dependencyCallback,
                    callers: [],
                    deferredCallbacks: []
                };
                _load(module, function () {
                    if(Engine.log) {
                        Engine.notify("Script " + module + " was loaded as dependency for: " + parentName, 'S');
                    }
                    loaded[module].afterLoad();
                });

            } else if (modules[module]) {
                dependencyCallback();
            } else if (loaded[module].callers.indexOf(parentName) === -1) {
                loaded[module].callers.push(parentName);
                loaded[module].deferredCallbacks.push(dependencyCallback);
            }
        }
    }
    return Engine;
})();

Engine.define('Ajax', (function () {
    var Ajax = {
        /**
         * @var object with key-value pairs with default ajax headers
         */
        headers: null
    };
    function addHeaders(xhr, headers){
        if (headers) {
            for (var i in headers) {
                if (headers.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, headers[i]);
                }
            }
        }
    }
    Ajax.ajax = function (data, resolve, reject) {
        var xhr = Ajax.getXhr();
        xhr.open(data.type, data.url, true);
        addHeaders(xhr, Ajax.headers);
        addHeaders(xhr, data.headers);
        xhr.onload = function () {
            if (xhr.status >199 && xhr.status < 300) {
                resolve(Ajax.process(xhr, data.responseType), xhr);
            } else if (reject) {
                reject(xhr)
            }
        };
        xhr.send(data.data);
        return xhr;
    };
    Ajax.process = function (xhr, t) {
        var response = xhr.responseText;
        if(t === 'text' || !response) {
            return response;
        } else {
            return JSON.parse(xhr.responseText);
        }
    };
    /**
     * @returns XMLHttpRequest
     */
    Ajax.getXhr = function () {
        var xmlhttp = null;
        try {
            xmlhttp = new XMLHttpRequest();
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    alert('Hey man, are you using browser?');
                }
            }
        }
        return xmlhttp;
    };
    return Ajax;
}));

Engine.define('Rest', 'Ajax', (function () {
    var Ajax = Engine.require('Ajax');

    var Rest = {
        host: null
    };
    Rest.doGet = function (url, responseType) {
        return Rest._onRequest(url, 'get', null, responseType)
    };
    Rest.doPost = function (url, data, responseType) {
        return Rest._onRequest(url, 'post', data, responseType)
    };
    Rest.doPut = function (url, data, responseType) {
        return Rest._onRequest(url, 'put', data, responseType)
    };
    Rest.doDelete = function (url, data, responseType) {
        return Rest._onRequest(url, 'delete', data, responseType)
    };
    Rest._onRequest = function (url, type, data, responseType) {
        if (Rest.host !== null) {
            url = Rest.host + url;
        }
        return new Promise(function (resolve, reject) {
            Ajax.ajax({
                responseType: responseType ? responseType : 'json',
                type: type,
                url: url,
                data: typeof data === 'string' || typeof data === 'number' ? data : JSON.stringify(data)
            }, resolve, reject)
        })
    };
    return Rest;
}));
Engine.define('Word', ['Rest'], function(){
    var Rest = Engine.require('Rest');
    var onLoad = {};
    var enLaguageLoaded = false;

    var Word = function(key, module, container, strategy) {
        if(!strategy && typeof container === 'string') {
            strategy = container;
            container = module;
            module = 'default';
        }
        if(!strategy) {
            strategy = 'text';
        }
        if(typeof module !== 'string' && !container) {
            container = module;
            module = 'default';
        }

        var clb = function(text){
            if(container.getAttribute('data-w-key') !== key) {
                container.setAttribute('data-w-key', key);
            }
            if(container.getAttribute('data-w-module') !== module) {
                container.setAttribute('data-w-module', module);
            }
            if(container.getAttribute('data-w-strategy') !== strategy) {
                container.setAttribute('data-w-strategy', strategy);
            }
            if(strategy != 'text') {
                if(strategy == 'append') {
                    container.appendChild(document.createTextNode(text));
                } else {
                    container.innerHTML = text;
                }
            } else {
                container.innerText = text;
            }
        };
        if(Word.languageLoaded(Word.language)) {
            clb(Word.get(key, module));
        } else {
            Word.loadLanguage(Word.language, function(){
                clb(Word.get(key, module))
            });
        }
    };
    Word.dictionaries = {};
    Word.dictionariesPath = 'assets/js/word/';

    Word.get = function(key, module, language){
        if(!language) language = Word.language;
        if(!module)module = 'default';
        var lang = Word.dictionaries[language];
        if(lang) {
            var mod = lang[module] || lang['default'] || {};
            return mod[key] !== undefined ? mod[key] : ((module ? module : 'default')  + ":" + key);
        } else {
            return null;
        }
    };

    Word.languageLoaded = function(language){
        if(!language) language = Word.language;
        return Word.dictionaries[language] !== undefined;
    };

    Word.loadLanguage = function(language, clb){
        if(typeof language === 'function' && !clb) {
            clb = language;
            language = Word.language;
        } else if(!language) {
            language = Word.language;
        }
        if(!onLoad[language]) {
            if(typeof clb === 'function') {
                onLoad[language] = [clb];
            } else {
                onLoad[language] = clb;
            }
        } else {
            if(typeof clb === 'function') {
                onLoad[language].push(clb);
            } else {
                onLoad[language] = onLoad[language].concat(clb);
            }
            return;
        }
        if(Word.loader) {
            Word.loader(language, onLoad[language]);
        } else {
            Rest.doGet(Word.dictionariesPath + language + '.json').then(
                function(dictionary){
                    var norm = {};
                    for(var k in dictionary) {
                        if(!dictionary.hasOwnProperty(k)) continue;
                        var value = dictionary[k];
                        if(typeof value === 'string') {
                            if(!norm.default) {
                                norm.default = {};
                            }
                            norm.default[k] = value;
                        } else {
                            norm[k] = value;
                        }
                    }
                    Word.dictionaries[language] = norm;
                    Word.language = language;
                    for(var i = 0; i < onLoad[language].length; i++) {
                        onLoad[language][i]();
                    }
                },
                function(){
                    if(!enLaguageLoaded) {
                        enLaguageLoaded = true;
                        Word.loadLanguage('en', onLoad[language]);
                        delete(onLoad[language]);
                    } else {
                        Engine.notify("Can't load language - " + language, 'E');
                    }
                }
            );

        }
    };
    Word.translate = function(language, node) {
        if(!language) language = Word.language;
        if(!node)node = document.body;
        function clb() {
            var words = node.getElementsByClassName('word');
            for(var i = 0; i < words.length; i++) {
                var w = words[i];
                var key = w.getAttribute('data-w-key');
                var module = w.getAttribute('data-w-module');
                var strategy = w.getAttribute('data-w-strategy');
                if(key) {
                    Word(key, module, w, strategy);
                }
            }
        }
        if(Word.languageLoaded(language)) {
            Word.language = language;
            clb();
        } else {
            Word.loadLanguage(language, clb);
        }
    };

    Word.create = function(defaultModule, defaultContainer) {
        var out = function(key, module, container, strategy){
            if(typeof module !== 'string') {
                container = module;
                module = null;
            }
            return Word(key, module || defaultModule, container || defaultContainer, strategy)
        };
        out.get = function(key, language){
            return Word.get(key, defaultModule, language);
        };
        out.languageLoaded = Word.languageLoaded;
        out.loadLanguage = Word.loadLanguage;
        out.translate = Word.translate;
        return out;
    };

    Word.language = navigator.language || navigator.userLanguage || 'en';
    return Word;
});
Engine.define("Config", (function () {
    function Config(configName) {
        this.configName = configName;
        try {
            this.storage = JSON.parse(localStorage.getItem(configName));
        } catch (e) {
            this.storage = null;
        }
        if (this.storage == null) {
            this.storage = {};
        }
    }
    Config.prototype.get = function (name) {
        return this.storage[name];
    };
    Config.prototype.has = function(name) {
        return this.get(name) !== undefined;
    };
    Config.prototype.set = function (name, value) {
        this.storage[name] = value;
        localStorage.setItem(this.configName, JSON.stringify(this.storage));
    };
    Config.prototype.remove = function (name) {
        delete(this.storage[name]);
        localStorage.setItem(this.configName, JSON.stringify(this.storage));
    };
    Config.prototype.toString = function() {
        return 'Config instance';
    };
    return Config;
}));
Engine.define('Dom', (function () {

    if(typeof Element !== undefined) {
        Element.prototype.isDomElement = true;
    }
    if(typeof HTMLElement !== undefined) {
        HTMLElement.prototype.isDomElement = true;
    }

    var Dom = {};
    /**
     * @param type string
     * @param attr object|null
     * @param content string|Element|Element[]
     * @returns {Element}
     */
    Dom.el = function (type, attr, content) {
        var o = document.createElement(type);
        Dom.update(o, attr);
        Dom.append(o, content);
        return o;
    };
    Dom.addClass = function (el, clazz) {
        if (el.className) {
            if (el.className.indexOf(clazz) === -1) {
                el.className += ' ' + clazz;
            } else if (el.className.split(' ').indexOf(clazz) === -1) {
                el.className += ' ' + clazz;
            }
        } else {
            el.className = clazz;
        }
    };
    Dom.removeClass = function (el, clazz) {
        var cl = el.className;
        if (cl && cl.indexOf(clazz) > -1) {
            var p = cl.split(' ');
            var i = p.indexOf(clazz);
            if (i > -1) {
                p.splice(i, 1);
                el.className = p.join(' ');
            }
        }
    };
    Dom.hasClass = function (el, clazz) {
        var cl = el.className;
        if (cl.indexOf(clazz) > -1) {
            return cl.split(' ').indexOf(clazz) > -1;
        } else {
            return false;
        }
    };
    Dom.id = function (id) {
        return document.getElementById(id);
    };
    Dom.update = function (el, attr) {
        if (typeof attr === 'string') {
            el.className = attr;
        } else if (attr)for (var i in attr) {
            if (!attr.hasOwnProperty(i))continue;
            var value = attr[i];
            if (typeof attr[i] == 'function') {
                var key = i;
                if (key.indexOf("on") === 0) {
                    key = key.substring(2);
                }
                el.addEventListener(key, value);
            } else {
                if(i === 'value') {
                    el.value = value;
                } else {
                    el.setAttribute(i, value)
                }
            }
        }
    };
    Dom.append = function (o, content) {
        if (content) {
            if (typeof content === 'string' || typeof content === 'number') {
                o.appendChild(document.createTextNode(content + ""));
            } else if (content.length && content.push && content.pop) {
                for (var i = 0; i < content.length; i++) {
                    var child = content[i];
                    if (child) {
                        Dom.append(o, child);
                    }
                }
            } else {
                //used prototyped property
                if(content.isDomElement) {
                    o.appendChild(content)
                } else if(content.container) {
                    Dom.append(o, content.container);
                } else {
                    throw "Can't append object"
                }
            }
        }
    };
    function iterateListeners(el, listeners, clb) {
        for(var key in listeners) {
            if(!listeners.hasOwnProperty(key))continue;
            var wrapper = listeners[key];
            var listnerName = key.indexOf('on') === 0 ? key.substring(2) : key;
            if(typeof wrapper === "function") {
                clb(el, listnerName, wrapper)
            } else {
                for(var i = 0; i < wrapper.length; i++) {
                    clb(el, listnerName, wrapper[i]);
                }
            }
        }
    }
    Dom.addListeners = function(el, listeners) {
        if(!listeners) {
            listeners = el;
            el = window;
        }
        iterateListeners(el, listeners, function(el, key, listener){
            el.addEventListener(key, listener, false);
        })
    };
    /**
     * Remove event listners
     * @param el Node|object
     * @param listeners object|null
     */
    Dom.removeListeners = function(el, listeners) {
        if(!listeners) {
            listeners = el;
            el = window;
        }
        iterateListeners(el, listeners, function(el, key, listener){
            el.removeEventListener(key, listener, false);
        })
    };

    Dom.calculateOffset = function (elem) {
        var top = 0, left = 0;
        if (elem.getBoundingClientRect) {
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            top = box.top + scrollTop - clientTop;
            left = box.left + scrollLeft - clientLeft;

            return {top: Math.round(top), left: Math.round(left)}
        } else {
            while (elem) {
                top = top + parseInt(elem.offsetTop);
                left = left + parseInt(elem.offsetLeft);
                elem = elem.offsetParent
            }
            return {top: top, left: left}
        }
    };
    Dom.insert = function(el, content, before) {
        if(el.innerHTML === '') {
            Dom.append(el, content);
            return;
        }
        if(!before)before = el.childNodes[0];

        if (content) {
            if (typeof content === 'string' || typeof content === 'number') {
                el.insertBefore(document.createTextNode(content + ""), before);
            } else if (content.length && content.push && content.pop) {
                for (var i = 0; i < content.length; i++) {
                    var child = content[i];
                    if (child) {
                        Dom.insert(el, child, before);
                    }
                }
            } else {
                //used prototyped property
                if(content.isDomElement) {
                    el.insertBefore(content, before);
                } else if(content.container) {
                    Dom.insert(el, content.container, before);
                } else {
                    throw "Can't inesert object"
                }
            }
        }
    };
    Dom.animate = function (el, values, time, frame, clb, timeToWait) {
        if (!timeToWait)timeToWait = 0;
        if (!frame)frame = 10;

        var animate = function (el, values, time, frame) {
            var intervals = [];
            for (var style in values) {
                if (!values.hasOwnProperty(style))continue;

                var from = el.style[style];
                if (!from && from !== 0) {
                    from = getComputedStyle(el)[style];
                }
                if (!from) {
                    el.style[style] = 0;
                    from = 0;
                } else {
                    from = parseInt(from);
                }
                var to = values[style];
                (function (style, from, step) {
                    el.style[style] = from + 'px';
                    intervals.push(setInterval(function () {
                        from += step;
                        el.style[style] = from + 'px';
                    }, frame));
                })(style, from, (to - from) * frame / time);
            }
            setTimeout(function () {
                for (var i = 0; i < intervals.length; i++) {
                    clearInterval(intervals[i]);
                }
            }, time);
        };
        setTimeout(function () {
            animate(el, values, time, frame, clb)
        }, timeToWait);

        timeToWait += time;

        return {
            animate: function (el, values, time, frame, clb) {
                return Dom.animate(el, values, time, frame, clb, timeToWait);
            },
            then: function (clb) {
                setTimeout(function(){clb()}, timeToWait);
            }
        };
    };
    return Dom
}));
Engine.define('KeyboardUtils', {
    translateButton: function(code) {
        switch (code) {
            case 9: return 'tab';
            case 13: return 'enter';
            case 16: return 'shift';
            case 17: return 'ctrl';
            case 18: return 'alt';
            case 20: return 'caps lock';
            case 27: return 'esc';
            case 32: return 'space';
            case 33: return 'pg up';
            case 34: return 'pg dn';
            case 35: return 'end';
            case 36: return 'home';
            case 37: return 'ar left';
            case 38: return 'ar top';
            case 39: return 'ar right';
            case 40: return 'ar bottom';
            case 45: return 'ins';
            case 46: return 'del';
            case 91: return 'super';
            case 96: return 'num 0';
            case 97: return 'num 1';
            case 98: return 'num 2';
            case 99: return 'num 3';
            case 100: return 'num 4';
            case 101: return 'num 5';
            case 102: return 'num 6';
            case 103: return 'num 7';
            case 104: return 'num 8';
            case 105: return 'num 9';
            case 106: return '*';
            case 107: return '+';
            case 109: return '-';
            case 111: return '/';
            case 112: return 'f2';
            case 113: return 'f3';
            case 114: return 'f4';
            case 115: return 'f5';
            case 116: return 'f6';
            case 117: return 'f7';
            case 119: return 'f8';
            case 120: return 'f9';
            case 121: return 'f10';
            case 122: return 'f11';
            case 123: return 'f12';
            case 144: return 'num lock';
            case 186: return ';';
            case 187: return '=';
            case 188: return ',';
            case 189: return '-';
            case 190: return '.';
            case 191: return '/';
            case 192: return '~';
            case 219: return '[';
            case 220: return '\\';
            case 221: return ']';
            case 222: return '\'';
            default: return String.fromCharCode(code);
        }
    }
});
Engine.define('ScreenUtils', {
    window: function () {
        var e = window, a = 'inner';
        if (!( a + 'Width' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {width: e[ a+'Width' ], height : e[ a+'Height' ]};
    },
    monitor: function () {
        return {width: outerWidth, height: outerHeight}
    }
});
Engine.define('StringUtils', (function () {

    var NORMAL_TEXT_REGEXP = /([a-z])([A-Z])/g;
    var REMOVE_FIRST_LAST_SLASHES = /^(\/)|(\/)$/g;
    var LOW_DASH = /\_/g;
    var DASH = /\-/g;

    var StringUtils = {
        unique: function (l) {
            return Math.random().toString(36).substring(2, l ? l + 2 : 7);
        },
        removeSlashes: function (str){
            return str.replace(REMOVE_FIRST_LAST_SLASHES, '');
        },
        capitalize: function(str){
            if(!str)return str;
            return str[0].toUpperCase() + str.substring(1);
        },
        normalizeText: function(str, glue){
            if(glue === undefined) {
                glue = ' ';
            }
            if(!str)str = '';
            if(str.indexOf('_') > -1) {
                str = str.replace(LOW_DASH, ' ');
            }
            if(str.indexOf('-') > -1) {
                str = str.replace(DASH, ' ');
            }
            if(str.match(NORMAL_TEXT_REGEXP)) {
                str = str.replace(NORMAL_TEXT_REGEXP, '$1 $2');
            }
            if(str.indexOf(' ') > -1) {
                var p = str.split(' ');
                var out = '';
                for (var i = 0; i < p.length; i++) {
                    if (!p[i])continue;
                    out += StringUtils.capitalize(p[i]) + (i !== p.length - 1 ? glue : '');
                }
                return out;
            } else {
                return StringUtils.capitalize(str);
            }
        }
    };

    return StringUtils;
}));
Engine.define('UrlUtils', 'StringUtils', function(){
    var StringUtils = Engine.require('StringUtils');

    var UrlUtils = {
        /**
         * Get path from document.location without trailing slashes
         * example:
         * (without arguments)
         * http://mysite.com/some/path/here/
         * UrlUtils.getPath() => some/path/here
         *
         * (with argument)
         * http://mysite.com/some/path/here/
         * UrlUtils.getPath(1) => some
         * UrlUtils.getPath(2) => path
         *
         * @returns string
         */
        getPath: function (index) {
            var path = StringUtils.removeSlashes(document.location.pathname);
            if(index) {
                return path.split('/')[index - 1];
            } else {
                return path;
            }
        },
        /**
         * Fetch query value from document.location
         *
         * example:
         * http://mysite.com?param=argument
         * UrlUtils.getQuery('param') => argument  (decoded)
         *
         * @param paramName
         * @returns string|null
         */
        getQuery: function(paramName) {
            var queryString = document.location.search.replace(QUESTION_CHAR, '');
            var queryArray = queryString.split('&');
            if(queryArray.length > 0) {
                var eqParamName = paramName + "=";
                for(var i = 0; i < queryArray.length; i++) {
                    if(queryArray[i].indexOf(eqParamName) === 0) {
                        return decodeURIComponent(queryArray[i].substring(eqParamName.length));
                    } else if(queryArray[i] === eqParamName || queryArray[i] === paramName) {
                        return "";
                    }
                }
            }
            return null;
        },

        appendQuery: function(name, value) {
            var path = UrlUtils.getPath();
            var oldValue = UrlUtils.getQuery(name);
            name = encodeURIComponent(name);
            var eqName = name + "=";
            var append = value || value === 0 ? eqName + encodeURIComponent(value) : name;

            var search = document.location.search;
            if(oldValue === null && search === "") {
                search = "?" + append;
            } else {
                var parts = search.replace(/^\?/, '').split("&");
                var done = false;
                if(search.indexOf(name) > -1) {
                    for (var i = parts.length - 1; i >= 0; i--) {
                        if (parts[i].indexOf(eqName) === 0 || parts[i] === name) {
                            parts[i] = append;
                            done = true;
                            break;
                        }

                    }
                }
                if(!done) {
                    parts.push(append);
                }
                search = "?" + parts.join("&");
            }
            history.push(path + search);
        },
        removeQuery: function(paramName){
            if(paramName) {
                var queryString = document.location.search.replace(QUESTION_CHAR, '');
                var queryArray = queryString.split('&');
                if(queryArray.length > 0) {
                    var eqParamName = paramName + "=";
                    for(var i = 0; i < queryArray.length; i++) {
                        if(queryArray[i].indexOf(eqParamName) === 0 || queryArray[i] === paramName) {
                            queryArray.splice(i, 1);
                            var path = UrlUtils.getPath();
                            history.push(path + (queryArray.length ? "?" + queryArray.join("&") : ''));
                            break;
                        }
                    }

                }
            }
        }
    };
    return UrlUtils;
});
Engine.define('Tabs', ['Dom'], (function(Dom) {

    var Tabs = function () {
        this.header = Dom.el('div', 'tabs-header');
        this.content = Dom.el('div', 'tabs-body');
        this.container = Dom.el('div', 'tabs', [this.header, this.content]);
        this.tabs = [];
    };
    Tabs.prototype.addTab = function (name, content) {
        var active = !this.tabs.length;
        var tab = {
            title: Dom.el('a', {href: '#', 'class': 'tab-name ' + (active ? 'active' : '')}, name),
            body: Dom.el('div', 'tab-content' + (active ? '' : ' hidden'), content)
        };
        this.tabs.push(tab);
        var me = this;
        tab.title.onclick = function (e) {
            e.preventDefault();
            for (var i = 0; i < me.tabs.length; i++) {
                Dom.addClass(me.tabs[i].body, 'hidden');
                Dom.removeClass(me.tabs[i].title, 'active');
            }
            Dom.removeClass(tab.body, 'hidden');
            Dom.addClass(tab.title, 'active');
        };
        this.header.appendChild(tab.title);
        this.content.appendChild(tab.body);
        return this.tabs.length - 1;
    };
    Tabs.prototype.removeTab = function (index) {
        var tab = this.tabs.splice(index, 1);
        tab.title.remove(true);
        tab.body.remove(true);
    };
    return Tabs;
}));
Engine.define('Pagination', ['Dom'], (function (Dom) {

    var Pagination = function (onOpenPage, pageNumber) {
        if (!onOpenPage || !pageNumber) {
            throw "Pagination instantiation error";
        }
        var me = this;
        this.refreshButton = Dom.el('input', {type: 'button', value: "Refresh"});
        this.refreshButton.onclick = function (e) {
            me.refresh(e)
        };

        this.page = Dom.el('input', {type: 'text', value: pageNumber});
        this.page.onkeyup = function (e) {
            me.onChange(e)
        };
        this.pageNumber = pageNumber;
        this.onOpenPage = onOpenPage;

        this.previousButton = Dom.el('input', {type: 'button', value: 'Previous page'});
        this.previousButton.onclick = function (e) {
            me.previous(e)
        };

        this.nextButton = Dom.el('input', {type: 'button', value: 'Next page'});
        this.nextButton.onclick = function (e) {
            me.next(e)
        };

        this.container = Dom.el(
            'form',
            {'class': 'pagination'},
            [this.refreshButton, this.previousButton, this.page, this.nextButton]
        );
        this.container.onsubmit = function (e) {
            me.refresh(e)
        };
    };
    Pagination.prototype.refresh = function (e) {
        if (e)e.preventDefault();
        this.openPage(this.pageNumber);
    };
    Pagination.prototype.previous = function (e) {
        if (e)e.preventDefault();
        this.openPage(this.pageNumber > 1 ? this.pageNumber - 1 : 1);
    };
    Pagination.prototype.next = function (e) {
        if (e)e.preventDefault();
        this.openPage(this.pageNumber + 1);
    };
    Pagination.prototype.openPage = function (page) {
        this.pageNumber = page;
        this.page.value = page;
        this.onOpenPage(page)
    };
    Pagination.prototype.regexp = /^\d*$/;

    Pagination.prototype.onChange = function () {
        if (this.regexp.test(this.page.value)) {
            this.pageNumber = parseInt(this.page.value);
            this.openPage(this.pageNumber);
        } else {
            this.page.value = this.pageNumber;
        }
    };
    return Pagination;
}));
Engine.define('Popup', ['Dom', 'ScreenUtils'], function () {

    var Dom = Engine.require('Dom');
    var ScreenUtils = Engine.require('ScreenUtils');

    var zIndex = 1000;
    var style = 'position:fixed;z-index' + zIndex + ';left:0;top:0;width:100%;height:100%;background: rgba(0,0,0,0.4)';
    var overlay = Dom.el('div', {style: style});
    var overlayShown = false;
    var count = 0;

    function Popup(params) {
        params = params || {};
        var me = this;
        this.title = Dom.el('div', null, params.title);
        this.isOpen = params.isOpen || false;
        this.minimized = params.minimized || false;
        this.withOverlay = params.withOverlay !== false;
        this.drag = {
            active: false,
            x: 0,
            y: 0,
            mx: 0,
            my: 0
        };
        this.listeners = {
            onmousemove: function (e) {
                me.onMouseMove(e);
            },
            onkeyup: function (e) {
                me.onKeyUp(e);
            }
        };

        this.initHeader(params);

        this.body = Dom.el('div', 'panel-body' + (this.minimized ? ' minimized' : ''), params.content);
        this.container = Dom.el('div', {class: 'Popup panel'}, [this.header, this.body]);
        if (params.isOpen) {
            this.show()
        }
    }


    Popup.prototype.initHeader = function (params) {
        var buttons = Dom.el('div', 'control-buttons', [

            params.controlMinimize === false ? null :
                Dom.el('button', {
                        class: 'success small Popup-minimize',
                        onclick: function () {
                            if (me.minimized) {
                                Dom.removeClass(me.container, 'minimized')
                            } else {
                                Dom.addClass(me.container, 'minimized')
                            }
                            me.minimized = !me.minimized;
                        }
                    },
                    Dom.el('span', null, '_')
                ),
            params.controlClose === false ? null : Dom.el('button', {
                    class: 'danger small Popup-close',
                    onclick: function () {
                        me.hide();
                    }
                },
                Dom.el('span', null, 'x')
            )
        ]);
        var content = [
            buttons,
            this.title
        ];
        this.header = Dom.el('div', 'panel-heading', content);
        var me = this;
        Dom.addListeners(this.header, {
            onmousedown: function (e) {
                if (e) {
                    e.preventBubble = true;
                    e.stopPropagation();
                    e.preventDefault();
                }
                me.onDragStart(e);
            },
            onmouseup: function (e) {
                if (e) {
                    e.preventBubble = true;
                    e.stopPropagation();
                    e.preventDefault();
                }
                me.onDragEnd();
            }
        });
    };
    Popup.prototype.onMouseMove = function (e) {
        if (this.drag.active) {
            var b = document.body;
            this.container.style.left = this.drag.x + (e.clientX - this.drag.mx + b.scrollLeft) + 'px';
            this.container.style.top = this.drag.y + (e.clientY - this.drag.my + b.scrollTop) + 'px';
        }
    };
    Popup.prototype.onDragEnd = function (e) {
        this.drag.active = false;
    };
    Popup.prototype.onDragStart = function (e) {
        if (!this.drag.active) {
            this.drag.active = true;
            this.drag.x = parseInt(this.container.style.left);
            this.drag.y = parseInt(this.container.style.top);

            var b = document.body;
            this.drag.mx = e.clientX + b.scrollLeft;
            this.drag.my = e.clientY + b.scrollTop;
        }
    };
    Popup.prototype.show = function () {
        if (this.withOverlay && !overlayShown) {
            document.body.appendChild(overlay);
        }
        count++;
        this.container.style.zIndex = ++zIndex;
        document.body.appendChild(this.container);
        Dom.addListeners(this.listeners);
        if(!this.isOpen) {
            this.isOpen = true;
            this.container.style.top = (document.body.scrollTop + 30) + 'px';
            this.container.style.left = ((ScreenUtils.window().width - this.container.offsetWidth) / 2) + 'px'
        }
    };
    Popup.prototype.setContent = function (content) {
        this.body.innerHTML = '';
        Dom.append(this.body, content);
    };
    Popup.prototype.setTitle = function (content) {
        this.title.innerHTML = '';
        Dom.append(this.title, content)
    };
    Popup.prototype.onKeyUp = function (e) {
        if (this.isOpen && e.keyCode == 27) {
            e.preventDefault();
            this.hide();
        }
    };
    Popup.prototype.hide = function () {
        count--;
        this.isOpen = false;
        if (count < 0) {
            count = 0;
        }
        if (count === 0) {
            overlay.remove();
        }
        this.container.remove();
        Dom.removeListeners(this.listeners);
    };

    Popup.getParams = function () {
        return {
            isOpen: false,
            minimized: false,
            content: null,
            title: null,
            controlClose: true,
            controlMinimize: true,
            withOverlay: true
        }
    };

    return Popup;
});
Engine.define('Menu', ['Dom', 'StringUtils'], function(Dom, StringUtils){

    function Menu(defaultCallback, params){
        this.container = Dom.el('div', params || 'menu');
        this.defaultCallback = defaultCallback;
        this.menus = [];
    }

    Menu.prototype.hide = function() {
        Dom.addClass(this.container, 'hidden');
    };
    Menu.prototype.show = function() {
        Dom.removeClass(this.container, 'hidden');
    };
    Menu.prototype.deactivateAll = function() {
        for(var i = 0; i < this.menus.length; i++) {
            Dom.removeClass(this.menus[i], 'active');
        }
    };

    Menu.prototype.menu = function(url, label, callback, _parentActivate) {
        var me = this;
        if(typeof label === 'function' && !callback) {
            callback = label;
            label = null;
        }
        if(url && !label) {
            label = StringUtils.normalizeText(url);
        }
        if(!callback && this.defaultCallback) {
            callback = this.defaultCallback;
        }
        var link = null;
        var item = Dom.el('div', 'menu-item');
        this.menus.push(item);
        var activate = function(e){
            if(!_parentActivate) {
                if(e)e.preventDefault();
                me.deactivateAll();
            } else {
                _parentActivate(e);
            }
            Dom.addClass(item, 'active');
        };
        if(url) {
            var params = {href: '/' + url};
            params.onclick = function (e) {
                activate(e);
                if (callback) {
                    callback(url, e);
                }
            };
            link = Dom.el('a', params, label);
            item.appendChild(link);
            if(StringUtils.removeSlashes(url) === StringUtils.removeSlashes(document.location.pathname)) {
                activate();
            }
        }
        var subMenuHolder = null;

        this.container.appendChild(item);
        return {
            menu: function (url, l, c) {
                return me.menu(url, l, c, activate);
            },
            subMenu: function (url, l, c) {
                var out = me.menu(url, l, c, activate);
                if(subMenuHolder === null) {
                    subMenuHolder = Dom.el('ul');
                    item.appendChild(subMenuHolder);
                }
                var childActivate = out.activate;
                out.activate = function (e) {
                    activate(e);
                    childActivate(e);
                };
                if(out.link) {
                    // Dom.removeListeners(out.link, {onclick: oldActivate});
                    Dom.addListeners(out.link, {onclick: activate});
                }
                subMenuHolder.appendChild(Dom.el('li', 'submenu', out.item));
                return out;
            },
            item: item,
            link: link
        }
    };
    return Menu;
});
Engine.define('Grid', ['Dom', 'Pagination', 'StringUtils'], function(){

    var Dom = Engine.require('Dom');
    var Pagination = Engine.require('Pagination');
    var StringUtils = Engine.require('StringUtils');

    function Grid(params){
        var me = this;
        this.header = Dom.el('thead');
        this.body = Dom.el('tbody');
        this.footer = Dom.el('tfoot');
        if(!params.columns) {
            throw 'columns is required parameter for grid';
        }
        var attr = {};
        this.params = params;

        if(params.class) {
            attr.class = params.class;
        }
        if(params.id) {
            attr.id = params.id;
        }
        this.table = Dom.el('table', null, [this.header, this.body, this.footer]);
        if(params.data) {
            this.data = params.data;
        } else {
            this.data = [];
        }
        var pagination = null;
        if(params.onOpenPage) {
            this.pagination = new Pagination(function(page){
                params.onOpenPage(
                    page
                ).then(function(info){
                    me.data = info.data;
                    me.update();
                })
            }, params.page || 1);
            pagination = this.pagination.container;
            this.pagination.refresh();
        }
        this.fullUpdate();
        this.container = Dom.el('div', null, [pagination, this.table]);
    }

    Grid.prototype.buildRow = function(index){
        if(this.params.rowRender) {
            return this.params.rowRender(index);
        } else {
            var cl = index % 2 ? 'odd' : 'even';
            return Dom.el('tr', cl);
        }
    };
    Grid.prototype.fullUpdate = function(){
        this.update();
        var params = this.params;
        if(params.class) {
            Dom.addClass(this.container, this.params.class);
        }
        if(params.id) {
            Dom.update(this.container, {id: params.id})
        }
        this.header.innerHTML = '';
        this.footer.innerHTML = '';
        var header = Dom.el('tr');
        var footer = Dom.el('tr');
        for(var i = 0; i < this.params.columns.length; i++) {
            var col = this.params.columns[i];
            var title = col.title || StringUtils.normalizeText(col.name);
            Dom.append(header, Dom.el('th', null, title));
            if(col.footer){
                Dom.append(footer, col.footer);
            }
        }
        this.header.appendChild(header);
        if(footer.innerHTML) {
            this.footer.appendChild(footer);
        }
    };
    Grid.prototype.update = function(){
        this.body.innerHTML = '';
        var cols = this.params.columns;
        var ds = this.data;
        for(var r = 0; r < ds.length; r++) {
            var row = this.buildRow(r);
            for(var c = 0; c < cols.length; c++) {
                var col = cols[c];
                var data = ds[r][col.name];
                if(col.render) {
                    Dom.append(row, Dom.el('td', col.class, col.render(data, ds[r])));
                } else {
                    Dom.append(row, Dom.el('td', col.class, data));
                }
            }
            Dom.append(this.body, row);
        }
    };


    return Grid;
});
Engine.define("AbstractInput", ['Dom', 'StringUtils'], (function(Dom, StringUtils){

    function AbstractInput(params) {
        if(!params.name)throw "Name is reqired for input";
        this.input = Dom.el(this.getElementType(), this.prepareAttributes(params), this.prepareContent(params));
        this.label = this.buildLabel(params);
        this.container = Dom.el('div', 'formfield-holder ' + (params.class || ''), [this.label, this.input]);
        this.errors = null;
        this.errorsData = null;
    }

    /**
     * Remove errors from input.
     * If first argument is null or undefined, all errors will be removed
     * if first argument is string, only error of this type will be removed
     * if first argument is array, all errors from this array will be removed
     * @param errorKeys
     */
    AbstractInput.prototype.removeErrors = function(errorKeys) {
        var errorsToShow = {};
        if(this.errorsData && errorKeys) {
            if(typeof errorKeys === 'string') {
                errorKeys = [errorKeys];
            }

            for (var key in this.errorsData) {
                if (this.errorsData.hasOwnProperty(key)) {
                    if(errorKeys.indexOf(key) === -1) {
                        errorsToShow[key] = this.errorsData[key];
                    }
                }
            }
        }
        this.errorsData = {};
        this.addError(errorsToShow);
    };
    AbstractInput.prototype.addError = function(errors) {
        if(this.errors === null) {
            this.errors = Dom.el('div', 'formfield-errors');
            this.container.appendChild(this.errors);
            this.errorsData = {};
        } else {
            this.errors.innerHTML = '';
        }
        if(typeof errors === 'string') {
            this.errorsData.custom = errors;
        } else {
            for(var ek in errors) {
                if(errors.hasOwnProperty(ek)) {
                    this.errorsData[ek] = errors[ek];
                }
            }
        }
        var out = {};
        for(var k in this.errorsData) {
            if(this.errorsData.hasOwnProperty(k) && this.errorsData[k]) {
                out[k] = Dom.el('div', 'err', this.errorsData[k]);
                this.errors.appendChild(out[k]);
            }
        }
        return out;
    };

    AbstractInput.prototype.buildLabel = function(params) {
        var content;
        if(params.noLabel === true) {
            content = null;
        } else if(params.label) {
            content = params.label;
        } else {
            content = StringUtils.normalizeText(params.name);
        }
        var attr = {for: this.input.id};
        return Dom.el('label', attr, content);
    };
    AbstractInput.prototype.getInputType = function() {
        throw "This function must be overrided";
    };
    AbstractInput.prototype.getElementType = function() {
        throw "This function must be overrided";
    };
    AbstractInput.prototype.prepareContent = function(params) {
        return null;
    };
    AbstractInput.prototype.prepareAttributes = function(params) {
        var out = {
            value: params.value || "",
            name: params.name,
            type: this.getInputType(),
            id: params.id || StringUtils.unique()
        };
        if(out.type === null) {
            delete out.type;
        }
        if(params.attr) {
            for(var key in params.attr) {
                if(params.attr.hasOwnProperty(key)) {
                    out[key] = params.attr[key];
                }
            }
        }
        for(var k in params) {
            if(!params.hasOwnProperty(k))continue;
            if(typeof params[k] === 'function') {
                out[k] = params[k];
            }
        }
        return out;
    };

    AbstractInput.prototype.getValue = function() {
        return this.input.value;
    };
    AbstractInput.prototype.setValue = function(value) {
        this.input.value = value;
    };
    return AbstractInput;
}));
Engine.define('Checkbox', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Checkbox(params) {
        AbstractInput.apply(this, arguments);
        Dom.append(this.container, [this.input, this.label]);
        this.input.checked = this._checked;
        delete(this._checked);
    }
    Checkbox.prototype = Object.create(AbstractInput.prototype);

    Checkbox.prototype.getElementType = function() {
        return 'input'
    };
    Checkbox.prototype.getInputType = function() {
        return 'checkbox';
    };

    Checkbox.prototype.getValue = function() {
        return this.input.checked;
    };
    Checkbox.prototype.setValue = function(value) {
        this.input.checked = value;
    };
    Checkbox.prototype.prepareAttributes = function(params) {
        var out = AbstractInput.prototype.prepareAttributes.apply(this, arguments);
        this._checked = !!params.value;
        delete out.value;
        return out;
    };
    Checkbox.prototype.toString = function() {
        return "Radio(" + this.input.name + ")";
    };
    Checkbox.toString = function() {
        return "Radio"
    };
    Checkbox.prototype.constructor = Checkbox;

    return Checkbox;
});
Engine.define('FieldMeta', function(){
    function FieldMeta(params){
        if(!params)params = {};
        this.ignore = params.ignore || false;//this field will be ignored on form building
        this.render = params.render || null;//Function for component render. Return type should have "AbstractInput" as parent.
        this.wrapper = params.wrapper || null;//if defined, all content will be putted inside of it. DOM node or function
        this.contentBefore = params.contentBefore || null;
        this.contentAfter = params.contentAfter || null;
        this.listeners = params.listeners || null;//callback functions. If this is function, it will listen onchange
        this.validations = params.validations || null;//validation rules
        this.removeErrors = params.removeErrors || null;//custom remove errors function
        this.errorMessages = params.errorMessages || null;//error messages holder. Should be object with key-value pairs or string
        this.options = params.options || null;//required field for "select", "radio", "checkboxes" component
        this.type = params.type || "text";//if render method not specified, this type will be used for component rendering
        this.label = params.label || null;//alternative label value
        this.wordKey = params.wordKey || null;//if form use word integration, this key will be used for label
        this.wordErrorKey = params.wordErrorKey || null;//if form use word integration, this key will be used for error message
    }
    return FieldMeta;
});
Engine.define('Text', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Text(params) {
        AbstractInput.apply(this, arguments);
    }
    Text.prototype = Object.create(AbstractInput.prototype);

    Text.prototype.getElementType = function() {
        return 'input'
    };
    Text.prototype.getInputType = function() {
        return 'text';
    };
    Text.prototype.toString = function() {
        return "Text(" + this.input.name + ")";
    };
    Text.toString = function() {
        return "Text"
    };
    Text.prototype.constructor = Text;
    return Text;
});
Engine.define('Select', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Select(params) {
        AbstractInput.apply(this, arguments);

        this.params = params;
        this.options = params.options;
        this.update(params.value);
    }
    Select.prototype = Object.create(AbstractInput.prototype);
    Select.prototype.constructor = Select;

    Select.prototype.update = function(value) {
        this.input.innerHTML = '';
        for(var i = 0; i < this.options.length; i++) {
            var opt = this.options[i];
            var option = Dom.el('option', {value: opt.value}, opt.label);
            Dom.append(this.input, option);
        }
    };
    Select.prototype.getElementType = function() {
        return 'select'
    };
    Select.prototype.getInputType = function() {
        return null;
    };
    Select.prototype.toString = function() {
        return "Select(" + this.input.name + ")";
    };
    Select.toString = function() {
        return "Select"
    };

    return Select;
});
Engine.define('Radio', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Radio(params) {
        AbstractInput.apply(this, arguments);
        this.input.remove();
        delete this.input;

        this.params = params;
        this.options = params.options;
        this.inputs = null;
        this.optionsContainer = Dom.el('div');
        this.update(params.value);
        this.container.appendChild(this.optionsContainer);
        Dom.insert(this.label, this.input);
    }
    Radio.prototype = Object.create(AbstractInput.prototype);
    Radio.prototype.constructor = Radio;

    Radio.prototype.update = function(value) {
        this.optionsContainer.innerHTML = '';
        this.inputs = [];
        var name = this.params.name;
        for(var i = 0; i < this.options.length; i++) {
            var opt = this.options[i];
            var input = Dom.el('input', {
                type: 'radio',
                id: name + "_" + opt.value,
                name: name,
                value: opt.value
            });
            if(opt.value === this.getValue() || opt.value === value) {
                input.checked = true;
            }
            var listeners = {};
            for(var key in this.params) {
                if(!this.params.hasOwnProperty(key))continue;
                if((key + "").indexOf('on') === 0 && typeof this.params[key] === 'function'){
                    listeners[key] = this.params[key];
                }
            }
            Dom.addListeners(input, listeners);
            this.inputs.push(input);
            this.optionsContainer.appendChild(
                Dom.el('label', {for: name + '_' + opt.value}, [input, opt.label])
            );
        }
    };
    Radio.prototype.getElementType = function() {
        return 'input'
    };
    Radio.prototype.getInputType = function() {
        return '';
    };
    Radio.prototype.getValue = function() {
        for(var i = 0; i < this.inputs.length; i++) {
            if(this.inputs[i].checked) {
                return this.inputs[i].value;
            }
        }
        return '';
    };
    Radio.prototype.toString = function() {
        return "Radio(" + this.input.name + ")";
    };
    Radio.toString = function() {
        return "Radio"
    };
    return Radio;
});
Engine.define('Password', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Password(params) {
        AbstractInput.apply(this, arguments);
        this.showChars = params.showChars || false;
        var me = this;
        this.toggler = Dom.el('a', {href: '#', onclick: function(e){
            e.preventDefault();
            me.toggleInput();
        }}, [this.getTogglerContent()]);
        this.container.appendChild(this.toggler);
    }
    Password.prototype = Object.create(AbstractInput.prototype);

    Password.prototype.getElementType = function() {
        return 'input'
    };
    Password.prototype.toggleInput = function() {
        this.showChars = !this.showChars;
        this.input.type = this.getInputType();
        this.toggler.innerHTML = this.getTogglerContent();
    };
    Password.prototype.getTogglerContent = function() {
        return this.showChars ? 'Hide' : 'Show';
    };
    Password.prototype.getInputType = function() {
        return this.showChars ? 'text' : 'password';
    };
    Password.toString = function() {
        return "Password"
    };
    Password.prototype.constructor = Password;

    return Password;
});
Engine.define('Textarea', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Textarea(params) {
        AbstractInput.apply(this, arguments);
    }
    Textarea.prototype = Object.create(AbstractInput.prototype);

    Textarea.prototype.getElementType = function() {
        return 'textarea'
    };
    Textarea.prototype.getInputType = function() {
        return null;
    };
    Textarea.toString = function() {
        return "Textarea"
    };
    Textarea.prototype.constructor = Textarea;
    return Textarea;
});
Engine.define("Validation", function () {
    var IS_EMAIL = /^([a-zA-Z0-9_.+-])+\@(([cd a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var cache = {};

    function _normalizeRules(rules) {
        if (typeof rules === 'string') {
            if (cache[rules] === undefined) {
                var strRules = rules.split(' ');
                var object = {};
                for (var i = 0; i < strRules.length; i++) {
                    var args = strRules[i].split(':');
                    var name = args.shift();
                    object[name] = args;
                }
                cache[rules] = object;
            }
            rules = cache[rules];
        } else if (!Array.isArray(rules)) {
            for (var k in rules) {
                if (rules.hasOwnProperty(k) && !Array.isArray(rules[k])) {
                    rules[k] = [rules[k]]
                }
            }
        }
        return rules ? rules : {};
    }

    var Validation = {
        /**
         * @param value
         * @param rules (if string: 'min:6 max:4 require') (if object: {require: true, min:[1], max: 5, custom: function(v){return v === 4}}
         * @returns []
         */
        validate: function (value, rules) {
            rules = _normalizeRules(rules);
            var errors = [];
            for (var rule in rules) {
                if (rules.hasOwnProperty(rule) && Validation.rules.hasOwnProperty(rule)) {
                    var isValid = Validation.rules[rule].apply(Validation.rules, [].concat(value, rules[rule]));
                    if (!isValid) {
                        errors.push(rule);
                    }
                } else {
                    throw "Unknown validation rule: " + rule + ". Please use one of the following: " + Object.keys(Validation.rules);
                }
            }
            return errors;
        },
        messages: {
            required: 'Can\'t be empty.',
            max: 'Number is too large.',
            min: 'Number is too small.',
            length: 'This is not valid length.',
            email: 'Invalid email address',
            number: 'Value is not a number',
            positive: 'Value is not a positive number',
            negative: 'Value is not a negative number',
            time: 'Invalid time format',
            dateString: 'Invalid date format.',
            timeString: 'Invalid time format, must be hh:mm:ss.',
            'default': 'Something wrong.'
        },
        rules: {
            required: function (v, flag) {
                if(!v) return false;
                if (flag === 'lazy') {
                    return ((v === '0' || (v.trim && v.trim() === '')) ? false : !!v)
                } else if (flag === 'checkboxes') {
                    for (var value in v) {
                        if (v.hasOwnProperty(value) && v[value]) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return !!v;
                }
            },
            max: function (v, limit) {
                if (!v)v = 0;
                return parseInt(v) <= limit;
            },
            min: function (v, limit) {
                if (!v)v = 0;
                return parseInt(v) >= limit;
            },
            length: function (v, min, max) {
                if (!v)v = "";
                return (max === undefined ? true : v.length <= max) && v.length >= min;
            },
            pattern: function (v, pattern) {
                return pattern.test(v);
            },
            number: function (v) {
                if (!v)return true;
                return Validation.rules.pattern(v, /^(-?\d*)$/g);
            },
            positive: function (v) {
                return Validation.rules.pattern(v, /^(\d*)$/g);
            },
            negative: function (v) {
                return Validation.rules.pattern(v, /^(-\d*)$/g);
            },
            email: function (v) {
                return Validation.rules.pattern(v, IS_EMAIL);
            },
            time: function (v) {
                if (!v)return true;
                var test = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
                return test.test(v);
            },
            custom: function (v, callback) {
                return callback(v);
            }
        }
    };
    return Validation;
});
Engine.define('UrlResolver', ['StringUtils'], function(StringUtils) {
    function UrlResolver(strategy) {
        this.mapping = [];
        this.strategy = strategy || 'path';
    }
    UrlResolver.prototype.resolve = function(url) {
        url = StringUtils.removeSlashes(url);
        if(url === '') {
            url = 'home';
        }
        var mapping = this.mapping;
        var parts = url.split('/');
        var params;
        var app = null;

        for(var k = 0; k < mapping.length; k++) {
            var compatible = false;
            params = {};
            var route = mapping[k];
            var data = route.data;
            if(data.length === parts.length || data[data.length - 1] === '*') {
                compatible = true;
                app = route.app;
                params = {};
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if(item.dynamic) {
                        params[item.name] = parts[i];
                    } else if(item.name === parts[i] || item.name === '*'){
                    } else {
                        compatible = false;
                        break;
                    }
                }
            }
            if(compatible) {
                app = route.app;
                break;
            } else {
                params = {};
                app = '';
            }
        }
        if(url === 'home') {
            url = '';
        }
        return {params: params, app: app, url: url};
    };
    UrlResolver.prototype.addMapping = function(className, url){
        if(typeof className !== 'string' || typeof url !== 'string') {
            throw 'Invalid arguments exception';
        }
        var mapping = this.mapping;
        var urlData = this.parseUrl(url);
        for(var i = 0; i< mapping; i++) {
            var data = mapping[i].data;
            var same = data.length === urlData.length;
            if(same) {
                for(var d = 0; d < data.length; d++) {
                    var oldItem = data[d];
                    var newItem = urlData[d];
                    if(!oldItem.dynamic && !newItem.dynamic) {
                        if(oldItem.name !== newItem.name) {
                            same = false;
                            break;
                        }
                    }
                }
            }
            if(same) {
                throw "Can't put two items with same request mapping: " + url;
            }
        }
        mapping.push({
            app: className,
            data: urlData
        });
    };
    UrlResolver.prototype.parseUrl = function(url){
        url = StringUtils.removeSlashes(url);
        var parts = url.split("/");
        var out = [];
        for(var i = 0; i < parts.length; i++) {
            var name = parts[i];
            var dynamic = name[0] == ':';
            if(dynamic) {
                name =  name.substring(1);
            }
            out.push({name: name, dynamic: dynamic});
        }
        return out;
    };
    return UrlResolver;
});
Engine.define('AbstractFieldsContainer', ['Dom', 'Text', 'Textarea', 'Radio', 'Select', 'Checkbox', 'Validation', 'Password', 'Word'], function(){

    var Dom = Engine.require('Dom');
    var Word = Engine.require('Word');
    var Text = Engine.require('Text');
    var Radio = Engine.require('Radio');
    var Select = Engine.require('Select');
    var Checkbox = Engine.require('Checkbox');
    var Password = Engine.require('Password');
    var Textarea = Engine.require('Textarea');
    var Validation = Engine.require('Validation');

    function AbstractFieldsContainer(data, fieldsMeta, containerMeta) {

        var html = [];
        this.fields = {};
        this.word = containerMeta.wordKey ? Word.create(containerMeta.wordKey) : null;
        this.model = data;
        this.containerMeta = containerMeta;

        if(!fieldsMeta) {
            fieldsMeta = {};
        }
        this.meta = fieldsMeta;
        for(var key in data) {
            if(!data.hasOwnProperty(key))continue;
            var value = data[key];
            var field;
            var fieldWordLabel = null;
            var fieldMeta = fieldsMeta[key];
            if(fieldMeta === false){
                continue;
            } else if(fieldMeta) {
                if(fieldMeta.ignore) {
                    continue
                }
                field = fieldMeta.render ?
                    (typeof fieldMeta.render === "function" ? fieldMeta.render(this.onChange, key, value) : fieldMeta.render) :
                    this.buildInput(key, value, fieldMeta);
                var content = [
                    typeof fieldMeta.contentBefore === 'function' ? fieldMeta.contentBefore(key, value) : fieldMeta.contentBefore,
                    field.container,
                    typeof fieldMeta.contentAfter === 'function' ? fieldMeta.contentAfter(key, value) : fieldMeta.contentAfter
                ];
                if(fieldMeta.wrapper) {
                    var wrapper = fieldMeta.wrapper;
                    if(typeof wrapper === 'function') {
                        html.push(wrapper(content, key, value));
                    } else {
                        Dom.append(wrapper, content);
                        if(html.indexOf(wrapper) === -1) {
                            html.push(wrapper);
                        }
                    }
                } else {
                    html = html.concat(content);
                }
                fieldWordLabel = fieldMeta.wordKey || null;
            } else {
                field = this.buildInput(key, value, null);
                html.push(field.container)
            }

            if(containerMeta.wordKey && field.label) {
                this.word(fieldWordLabel || "label_" + key, field.label)
            }
            this.fields[key] = field;
        }
        this.container = this.createContainer();
        Dom.append(this.container, html);
    }

    AbstractFieldsContainer.resolvers = [
        function(params, meta, metaType){
            return (metaType === 'select') || params.options && params.options.length > 3 ? new Select(params) : null;
        },
        function(params, meta, metaType) {
            return (metaType === 'radio') || params.options && params.options.length > 3 ? new Radio(params) : null;
        },
        function(params, meta, metaType) {
            return (metaType === 'checkbox') || typeof params.value === 'boolean' ? new Checkbox(params) : null;
        },
        function(params, meta, metaType) {
            return metaType === 'password' ||
            (typeof params.name === 'string' && params.name.toLowerCase().indexOf('pass') > -1) ?
                new Password(params) : null;
        },
        function(params, meta, metaType) {
            return metaType === 'textarea' ||
            (typeof params.value === 'string' && (params.value.indexOf('\n')  > -1 || params.value.length > 40)) ?
                new Textarea(params) : null;
        },
        function(params, meta, metaType) {
            return metaType === 'text' || typeof params.value !== 'object' ? new Text(params) : null
        }
    ];

    AbstractFieldsContainer.prototype.validateField = function(fieldName){
        var meta = this.meta[fieldName];
        var field = this.fields[fieldName];
        if(field instanceof AbstractFieldsContainer) {
            return field.validate();
        }
        if(!meta || meta.ignore === true) {
            return true;
        }
        var value = this.model[fieldName];

        if(meta.removeErrors) {
            meta.removeErrors()
        } else if(field.removeErrors) {
            field.removeErrors();
        }
        if(meta.validations) {
            var errorKeys = Validation.validate(value, meta.validations);

            if(errorKeys.length > 0) {
                var messages = this.findErrorMessages(meta, errorKeys);
                if(meta.addError) {
                    meta.addError(messages);
                } else if(field.addError){
                    var errorFields = field.addError(messages);
                    if(this.word) {
                        for(var errorKey in errorFields) {
                            if(!errorFields.hasOwnProperty(errorKey))continue;
                            var errorHtml = errorFields[errorKey];
                            var wordErrorKey;
                            if(meta.wordErrorKey) {
                                if(typeof meta.wordErrorKey === 'string') {
                                    wordErrorKey = meta.wordErrorKey;
                                } else {
                                    wordErrorKey = meta.wordErrorKey[errorKey];
                                }
                            }
                            this.word(wordErrorKey || "error_" + fieldName, errorHtml);
                        }
                    }
                }
                return false;
            } else {
                return true;
            }
        }
        return true;
    };
    AbstractFieldsContainer.prototype.validate = function(){
        if(this.meta) {
            var formValidation = true;
            for(var key in this.meta) {
                if(!this.meta.hasOwnProperty(key))continue;
                var fieldValidation = this.validateField(key);
                if(formValidation && !fieldValidation) {
                    formValidation = false;
                }
            }
            return formValidation;
        } else {
            return true;
        }
    };

    AbstractFieldsContainer.prototype.findErrorMessages = function(meta, errorKeys){
        var out = {};
        for(var i = 0; i < errorKeys.length; i++) {
            var key = errorKeys[i];
            if(meta && typeof meta.errorMessages === 'string') {
                out[key] = meta.errorMessages;
            } else if(meta && meta.errorMessages && meta.errorMessages[key] !== undefined ){
                out[key] = meta.errorMessages[key];
            } else if(Validation.messages[key] !== undefined) {
                out[key] = Validation.messages[key];
            } else {
                out[key] = Validation.messages['default'];
            }
        }
        return out;
    };
    AbstractFieldsContainer.prototype.onChange = function(key, value){
        this.model[key] = value;
        this.validateField(key);
    };
    AbstractFieldsContainer.prototype.buildInput = function(key, value, meta){
        var me = this;
        var out = null;
        var listeners = null;
        var params = {name: key, value: value};
        var metaType = null;

        if(meta) {
            listeners = meta.listeners;
            params.options = meta.options || null;
            params.label = meta.label || null;
            if(meta.label === false) {
                params.noLabel = true;
            }
            metaType = meta.type || null;
        }

        var onchange = null;
        var onkeyup = null;
        if(listeners) {
            if(typeof listeners === 'function') {
                listeners = {onchange: listeners};
            }
            for(var eventName in listeners) {
                if(listeners.hasOwnProperty(eventName)) {
                    var lc = eventName.toLowerCase();
                    var eventListener = listeners[eventName];
                    if(lc === 'onchange' || lc === 'change') {
                        onchange = eventListener;
                    } else if(lc === 'onkeyup' || lc === 'keyup') {
                        onkeyup = eventListener
                    } else {
                        params[eventName] = eventListener;
                    }
                }
            }
        }
        params.onchange = function(e){
            me.onChange(key, out.getValue());
            if(onchange){
                onchange(e);
            }
        };
        params.onkeyup = function(e){
            me.onChange(key, out.getValue());
            if(onkeyup){
                onkeyup(e);
            }
        };


        for(var i = 0; i < AbstractFieldsContainer.resolvers.length; i++) {
            out = AbstractFieldsContainer.resolvers[i](params, meta, metaType);
            if(out != null) {
                break;
            }
        }
        if(out != null) {
            return out;
        } else {
            throw "Can't instantiate field for " - params.value;
        }
    };

    return AbstractFieldsContainer;
});
Engine.define('GenericFieldset', ['Dom', 'AbstractFieldsContainer'], function(){

    var Dom = Engine.require('Dom');
    var AbstractFieldsContainer = Engine.require('AbstractFieldsContainer');


    function GenericFieldset(data, fieldsMeta, formMeta) {
        AbstractFieldsContainer.apply(this, arguments);
    }
    GenericFieldset.prototype = Object.create(AbstractFieldsContainer.prototype);


    AbstractFieldsContainer.resolvers.unshift(function(params, meta, metaType) {
        return metaType === 'fieldset' || typeof params.value === 'object' ?
            new GenericFieldset(params.value, meta.metaData, meta) : null
    });

    GenericFieldset.prototype.createContainer = function(){
        var attr = {};
        var meta = this.containerMeta || {};
        if(meta.id)attr.id = meta.id;
        if(meta.class)attr.class = meta.class;
        var legend;

        if(meta.legend === false) {
            legend = null;
        } else if(typeof meta.legend === 'string') {
            legend = Dom.el('legend', null, meta.legend);
        }
        if(this.word && meta.wordLegend) {
            this.word(meta.wordLegend, legend);
        } else if(!legend && meta.legend) {
            legend = meta.legend;
        }
        return Dom.el('fieldset', attr, legend);
    };

    return GenericFieldset;
});
Engine.define('GenericForm', ['AbstractFieldsContainer', 'Dom'], function(){

    var Dom = Engine.require('Dom');
    var AbstractFieldsContainer = Engine.require('AbstractFieldsContainer');

    function GenericForm(data, fieldsMeta, formMeta) {
        AbstractFieldsContainer.apply(
            this,
            GenericForm.prepareArguments(data, fieldsMeta, formMeta)
        );
        if(!formMeta)formMeta = fieldsMeta;
        if(formMeta.submitButton === false) {
            this.submit = null;
        } else if(formMeta.submitButton) {
            this.submit = formMeta.submitButton;
        } else {
            this.submit = Dom.el('div', null, Dom.el('input', {type: 'submit', class: 'primary', value: 'Submit'}));
        }
        Dom.append(this.container, this.submit);
    }
    GenericForm.prototype = Object.create(AbstractFieldsContainer.prototype);

    GenericForm.prepareArguments = function(data, fieldsMeta, formMeta) {
        if(formMeta === undefined) {
            formMeta = fieldsMeta;
            fieldsMeta = null;
        }
        if(typeof formMeta === 'function') {
            formMeta = {onSubmit: formMeta};
        }
        if(!formMeta.onSubmit)throw 'onSubmit is required for generic form';
        return [data, fieldsMeta, formMeta];
    };

    GenericForm.prototype.createContainer = function(){
        var me = this;
        var attr = {onsubmit: function(e){
            me.onSubmit(e)
        }};
        var meta = this.containerMeta || {};
        if(meta.class)attr.class = meta.class;
        if(meta.id)attr.id = meta.id;
        var title = null;
        if(typeof meta.title === 'string') {
            title = Dom.el('h3', null, meta.title);
        } else if (meta.title) {
            title = meta.title;
        }
        return Dom.el('form', attr, title);
    };
    GenericForm.prototype.onSubmit = function(e){
        if(e)e.preventDefault();
        if(this.validate()) {
            this.containerMeta.onSubmit(this.model)
        }
    };

    return GenericForm;
});
Engine.define('Dispatcher', ['Dom', 'UrlResolver', 'UrlUtils'], function () {

    var Dom = Engine.require('Dom');
    var UrlUtils = Engine.require('UrlUtils');
    var UrlResolver = Engine.require('UrlResolver');

    var Dispatcher = function(appNode, context, urlResolver){
        this.app = typeof appNode === 'string' ? Dom.id(appNode) : appNode;
        this.context = context || {};
        this.applications = {};
        this.applicationName = null;
        this.activeApplication = null;
        this.history = history;
        this.urlResolver = urlResolver || (new UrlResolver());
        var me = this;
        var openApplication = function(){
            if(me.urlResolver) {
                var path = UrlUtils.getPath();
                me.placeApplication(path);
            }
        };
        Dom.addListeners({onpopstate: openApplication});
        this.events = null;
        context.dispatcher = this;
    };

    Dispatcher.prototype.addMapping = function(className, url) {
        this.urlResolver.addMapping(className, url);
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

    Dispatcher.prototype.placeApplication = function (url, directives) {
        if(!url) {
            url = UrlUtils.getPath();
        }
        var me = this;
        var request = me.urlResolver.resolve(url);
        var applicationName;
        if(request.app) {
            applicationName = request.app;
        } else {
            applicationName = 'Page404';
        }
        var application = me.applications[applicationName];
        if(application) {
            explodeApplication(me, request, applicationName, directives);
        } else {
            Engine.load(applicationName, function() {
                me.applications[applicationName] = Engine.require(applicationName);
                explodeApplication(me, request, applicationName, directives);
            })
        }
    };

    Dispatcher.prototype.fireEvent = function(eventType, applicationName){
        if(this.events === null) return;
        if(!this.events[eventType])return;
        var events = this.events[eventType];
        for(var i = 0; i < events.length; i++) {
            events[i](applicationName);
        }
    };


    //private functions

    function explodeApplication(dispatcher, request, applicationName, directives) {
        var applicationClass = dispatcher.applications[applicationName];
        if (!applicationClass) {
            throw "Undefined application " + applicationName;
        }
        var contextUpdate = function(){
            if(dispatcher.context) {
                dispatcher.context.request = request
            }
        };
        var windowUpdate = function(app){
            var title = getTitle(app);
            var path = UrlUtils.getPath();
            if(request.url !== path) {
                var hash = document.location.hash;
                this.history.pushState({}, title, "/" + (request.url || '') + (hash || ''));
            }
        };

        if(dispatcher.applicationName === applicationName && dispatcher.activeApplication.canStay) {
            contextUpdate();
            windowUpdate(dispatcher.activeApplication);
            var isCanStay = dispatcher.activeApplication.canStay();
            if(isCanStay !== false) {
                return;
            }
        }
        closeApplication(dispatcher, applicationName);
        contextUpdate();
        var app = initApplication(dispatcher, applicationClass);
        windowUpdate(app);
        openApplication(dispatcher, app, request.params, directives, applicationName);
    }

    function initApplication (dispatcher, contructor) {
        var application;
        if(typeof contructor == "function") {
            application = new contructor(dispatcher.context);
        } else {
            application = contructor;
            if(application.init) {
                application.init(dispatcher.context);
            }
        }
        return application;
    }

    function closeApplication(dispatcher) {
        var app = dispatcher.activeApplication;
        if (app) {
            var appName = dispatcher.applicationName;
            dispatcher.fireEvent('beforeClose', appName);
            if (app.beforeClose) {
                app.beforeClose();
            }
            dispatcher.app.innerHTML = '';
            if (app.afterClose) {
                app.afterClose();
            }
            dispatcher.fireEvent('afterClose', appName);
        }
    }
    function getTitle(app) {
        if(app.getTitle) {
            return app.getTitle();
        } else if (app.TITLE || app.title) {
            return app.TITLE || app.title;
        } else {
            return '';
        }
    }
    function openApplication(dispatcher, app, params, directives, applicationName){
        dispatcher.fireEvent('beforeOpen', applicationName);
        dispatcher.activeApplication = app;
        dispatcher.applicationName = applicationName;
        if (app.beforeOpen) {
            app.beforeOpen(params, directives);
        }
        if(app.container) {
            dispatcher.app.appendChild(app.container);
        }
        if (app.afterOpen) {
            app.afterOpen(params, directives);
        }
        dispatcher.fireEvent('afterOpen', applicationName);
    }

    return Dispatcher;
});