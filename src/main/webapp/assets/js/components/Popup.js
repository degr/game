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
        this.container = Dom.el('div', {class: 'modal panel'}, [this.header, this.body]);
        if (params.isOpen) {
            this.show()
        }
    }


    Popup.prototype.initHeader = function (params) {
        var buttons = Dom.el('div', 'control-buttons', [

            params.controlMinimize === false ? null :
                Dom.el('button', {
                        class: 'success small modal-minimize',
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
                    class: 'danger small modal-close',
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