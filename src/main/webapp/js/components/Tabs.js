var Tabs = function() {
    this.header = Dom.el('div', 'tabs-header');
    this.content = Dom.el('div', 'tabs-body');
    this.container = Dom.el('div', 'tabs', [this.header, this.content]);
    this.tabs = [];
};
Tabs.prototype.addTab = function(name, content) {
    var active = !this.tabs.length;
    var tab = {
        title: Dom.el('a', {href: '#', 'class': 'tab-name ' + (active ? 'active' : '')}, name),
        body: Dom.el('div', 'tab-content' + (active ? '' : ' hidden'), content)
    };
    this.tabs.push(tab);
    var me = this;
    tab.title.onclick = function(e) {
        e.preventDefault();
        for(var i = 0; i < me.tabs.length; i++) {
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
Tabs.prototype.removeTab = function(index) {
    var tab = this.tabs.splice(index, 1);
    tab.title.remove(true);
    tab.body.remove(true);
};