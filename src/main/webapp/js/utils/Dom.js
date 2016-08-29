Engine.define('Dom', (function () {
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
    }
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
            if (typeof attr[i] == 'function') {
                var key = i;
                if (key.indexOf("on") === 0) {
                    key = key.substring(2);
                }
                el.addEventListener(key, attr[i]);
            } else {
                el.setAttribute(i, attr[i])
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
                o.appendChild(content)
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
                el.insertBefore(content, before);
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