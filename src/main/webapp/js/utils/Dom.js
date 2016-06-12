var Dom = {
    /**
     * @param type string
     * @param attr object|null
     * @param content string|Element|Element[]
     * @returns {Element}
     */
    el: function (type, attr, content) {
        var o = document.createElement(type);
        Dom.update(o, attr);
        Dom.append(o, content);
        return o;
    },
    addClass: function(el, clazz) {
        if(el.className) {
            if(el.className.indexOf(clazz) === -1) {
                el.className += ' ' + clazz;
            } else if(el.className.split(' ').indexOf(clazz) === -1) {
                el.className += ' ' + clazz;
            }
        } else {
            el.className = clazz;
        }
    },
    removeClass: function(el, clazz) {
        var cl = el.className;
        if(cl && cl.indexOf(clazz) > -1) {
            var p = cl.split(' ');
            var i = p.indexOf(clazz);
            if(i > -1) {
                p.splice(i, 1);
                el.className = p.join(' ');
            }
        }
    },
    hasClass: function (el, clazz) {
        var cl = el.className;
        if(cl.indexOf(clazz) > -1) {
            return cl.split(' ').indexOf(clazz) > -1;
        } else {
            return false;
        }
    },
    id: function (id) {
        return document.getElementById(id);
    },
    update: function(el, attr) {
        if(typeof attr === 'string'){el.className = attr;
        }else if(attr)for(var i in attr)el.setAttribute(i, attr[i]);
    },
    append: function(o, content) {
        if(content) {
            if(typeof content === 'string' || typeof content === 'number') {
                o.appendChild(document.createTextNode(content + ""));
            } else if(content.length) {
                for(var i = 0;i<content.length;i++) {
                    var child = content[i];
                    if(child) {
                        o.appendChild(typeof child === 'string' ? document.createTextNode(child) : child)
                    }
                }
            } else {
                o.appendChild(content)
            }
        }
    },
    calculateOffset: function (elem) {
        var top=0, left=0
        if (elem.getBoundingClientRect) {
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            top  = box.top +  scrollTop - clientTop;
            left = box.left + scrollLeft - clientLeft;

            return { top: Math.round(top), left: Math.round(left) }
        } else {
            while(elem) {
                top = top + parseInt(elem.offsetTop);
                left = left + parseInt(elem.offsetLeft);
                elem = elem.offsetParent
            }
            return {top: top, left: left}
        }
    }
};