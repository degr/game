(function (e, t, n) {
    "use strict";
    function s(e) {
        return e.outerHTML || function (e) {
                var t = document.createElement("div"), n;
                t.appendChild(e.cloneNode(true));
                n = t.innerHTML;
                t = null;
                return n
            }(e)
    }

    function o(e) {
        return e.offsetWidth > 0 && e.offsetHeight > 0
    }

    function u(e, t) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(e, "").getPropertyValue(t)
        } else if (e.currentStyle) {
            t = t.replace(/-(w)/g, function (e, t) {
                return t.toLowerCase()
            });
            return e.currentStyle[t]
        }
        return ""
    }

    function a() {
        var e = document.body, t, i, s;
        if (e.hasChildNodes()) {
            t = e.childNodes;
            if (typeof t !== "undefined") {
                for (i = 1, s = t.length; i < s; i += 1) {
                    if (t[i].nodeType === 1 && t[i].nodeName !== "SCRIPT" && t[i].nodeName !== "STYLE") {
                        if (parseInt(u(t[i], "z-index"), 10) >= r && parseInt(u(t[i], "top"), 10) < n) {
                            t[i].setAttribute("style", t[i].getAttribute("style") + "z-index:" + (r - 1) + " !important;" + "top:" + n + "px !important;")
                        }
                    }
                }
            }
        }
    }

    function f() {
        var i = document.body, o = i.firstChild, u = " !important;", l;
        l = document.createElement("iframe");
        l.src = e;
        l.id = t;
        if (l.addEventListener) {
            l.addEventListener("DOMNodeRemovedFromDocument", f)
        }
        l.setAttribute("style", ["height: " + n + "px", "max-height: " + n + "px", "min-height: " + n + "px", "width: 100% ", "min-width: 100%", "max-width: 100%", "display: block", "visibility: visible", "position: fixed", "border: none", "top: 0", "left: 0", "float: none", "opacity: 0.9", "z-index: " + r, "margin: 0", "padding: 0", "transition: none", "transform: none", "overflow: hidden"].join(u) + u);
        i.style.paddingTop = n + "px";
        if (o) {
            o.parentNode.insertBefore(l, o)
        } else {
            i.appendChild(l)
        }
        a();
        return s(l)
    }

    var r = 2147483647, i;
    i = f();
    setInterval(function () {
        var e = document.getElementById(t);
        if (!e) {
            f()
        } else {
            if (i !== s(e) || !o(e)) {
                e.parentNode.removeChild(e)
            }
        }
        a()
    }, 3e3)
})("//res.mycloud.by/banner/index.html", "trial-header-" + parseInt(Math.random() * 1e5, 10), 85)