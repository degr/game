Engine.define('Popup', ['Dom'], function(){
    
    var Dom = Engine.require('Dom');
    var zIndex = 1000;
    var style = 'position:fixed;z-index'+zIndex+';left:0;top:0;width:100%;height:100%;background: rgba(0,0,0,0.4)';
    var overlay = Dom.el('div', {style: style});
    var overlayShown = false;
    var count = 0;
    function Popup(content, title){
        var me = this;
        this.title = Dom.el('div', null, title);
        this.header = Dom.el('div', 'panel-heading', [Dom.el('button', {
            class: 'danger small modal-close',
            onclick: function(){
                me.hide();
            }
        }, Dom.el('span', null, 'x')), this.title]);
        this.body = Dom.el('div', 'panel-body', content);
        this.container = Dom.el('div', {class: 'modal panel'}, [this.header, this.body]);
    }

    Popup.prototype.show = function()  {
        if(!overlayShown) {
            document.body.appendChild(overlay);
        }
        count++;
        this.container.style.zIndex = ++zIndex;
        document.body.appendChild(this.container);
    };
    Popup.prototype.setContent = function(content) {
        this.body.innerHTML = '';
        Dom.append(this.body, content)
    };
    Popup.prototype.setTitle = function(content) {
        this.title.innerHTML = '';
        Dom.append(this.title, content)
    };
    Popup.prototype.hide = function() {
        count--;
        if(count < 0) {
            count = 0;
        }
        if(count === 0) {
            overlay.remove();
        }
        this.container.remove();
    };

    return Popup;
});