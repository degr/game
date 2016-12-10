Engine.define("Modal", ['Dom'], function(){
    var Dom = Engine.require('Dom');

    function Modal(content, title) {
        var me = this;
        this.header = Dom.el('div', 'header', [
            title || "&nbsp;",
            Dom.el('div', 'controls', [
                Dom.el('a', {onclick: function(e){
                    e.preventDefault();
                    me.close()}
                }, 'x')
            ])
        ]);
        this.content = Dom.el('div', 'content', content);
        this.container = Dom.el('div', {class: 'modal', draggable: 'true'}, [this.header, this.content]);

        this.transportable = {
            mouseX: 0,
            mouseY: 0,
            offsetX: 0,
            offsetY: 0,
            dragStart: false
        };

        this.container.style.position = 'fixed';
        var listeners = {
            dragstart: function (e) {
                me.handleDragStart(e)
            },
            dragenter: function (e) {
                me.handleDragEnter(e)
            },
            dragover: function (e) {
                me.handleDragOver(e)
            },
            dragleave: function (e) {
                me.handleDragLeave(e)
            },
            drop: function (e) {
                me.handleDrop(e)
            },
            dragend: function (e) {
                me.handleDragEnd(e)
            }
        };
        Dom.addListeners(this.container, listeners);


        DomComponents.doModal(this.container);
    }

    Modal.prototype.show = function () {
        var me = this;
        if(document.body) {
            document.body.appendChild(this.container);
        } else {
            setTimeout(function () {
                me.show();
            }, 50)
        }
        document.addEventListener("dragover", function (e) {
            if (me.transportable.dragStart) {
                me.transportable.mouseX = e.clientX;
                me.transportable.mouseY = e.clientY;
            }
        }, false);
    };

    Modal.prototype.hide = function() {
        var me = this;
        me.container.remove();
        document.removeEventListener("dragover", function (e) {
            if (me.transportable.dragStart) {
                me.transportable.mouseX = e.clientX;
                me.transportable.mouseY = e.clientY;
            }
        }, false);
    };



    Modal.prototype.handleDragEnd = function () {
        var transportable = this.transportable;
        Dom.removeClass(this.container, 'over');
        this.container.style.opacity = null;
        this.container.style.left = (transportable.mouseX - transportable.offsetX) + 'px';
        this.container.style.top = (transportable.mouseY - transportable.offsetY) + 'px';
        transportable.dragStart = false;
    };
    Modal.prototype.handleDrop = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    };

    Modal.prototype.handleDragStart = function (e) {
        if (document.activeElement && ['input', 'textarea', 'select'].indexOf(document.activeElement.tagName.toLowerCase()) > -1) {
            e.preventDefault();
            return false;
        }
        var transportable = this.transportable;
        this.container.style.opacity = '0.4';
        var offset = Dom.calculateOffset(this.container);
        transportable.offsetX = e.clientX - offset.left;
        transportable.offsetY = e.clientY - offset.top;
        this.container.style.left = (e.clientX - transportable.offsetX) + "px";
        this.container.style.top = (e.clientY - transportable.offsetY) + "px";
        this.container.style.right = 'initial';
        this.container.style.bottom = 'initial';
        transportable.dragStart = true;
    };

    /**
     *
     * @param e Event
     * @returns {boolean}
     */
    Modal.prototype.handleDragOver = function (e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    };

    Modal.prototype.handleDragEnter = function () {
        Dom.addClass(this.container, 'over');
    };

    Modal.prototype.handleDragLeave = function () {
        Dom.addClass(this.container, 'over');
    };
    return Modal;
});