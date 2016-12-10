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