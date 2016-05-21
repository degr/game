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
            if(el.className.indexOf(clazz) === -1 || el.className.split(' ').indexOf(clazz) === -1) {
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
                o.appendChild(document.createTextNode(content));
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
    }
};