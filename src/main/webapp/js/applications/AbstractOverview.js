Engine.define('AbstractOverview', ['StringUtils', 'Dom', 'Rest', 'Grid', 'MainMenu', 'GenericForm', 'Popup'], function(){
    var Dom = Engine.require('Dom');
    var Grid = Engine.require('Grid');
    var Rest = Engine.require('Rest');
    var MainMenu = Engine.require('MainMenu');
    var GenericForm = Engine.require('GenericForm');
    var StringUtils = Engine.require('StringUtils');
    var Popup = Engine.require('Popup');
    
    function AbstractOverview(context, placeApplication) {
        this.TITLE = StringUtils.normalizeText(this.getEntityName());
        this.url = this.getEntityName().toLowerCase() + 's';
        
        this.context = context;
        var mainMenu = new MainMenu(context, placeApplication);
        this.placeApplication = placeApplication;
        var me = this;
        this.page = 1;
        this.editModal = new Popup(null, 'Edit ' + this.TITLE);

        
        this.grid = new Grid({
            columns: this.getColumns(),
            onOpenPage: function(page){
                return me.update(page);
            }
        });

        this.container = Dom.el('div', this.url, [
            mainMenu.container,
            Dom.el('h1', null, this.TITLE),
            this.grid.container
        ])
    }

    AbstractOverview.prototype.getColumns = function() {
        throw 'Implement me!';
    };
    AbstractOverview.prototype.getEntityName = function() {
        throw 'Implement me!';
    };
    AbstractOverview.prototype.getUpdateMessage = function(entity) {
        throw 'Implement me!';
    };
    AbstractOverview.prototype.getUpdateFail = function(entity) {
        throw 'Implement me!';
    };
    AbstractOverview.prototype.getDeleteMessage = function(entity) {
        throw 'Implement me!';
    };
    AbstractOverview.prototype.getAfterDeleteMessage = function(entity) {
        throw 'Implement me!';
    };
    AbstractOverview.prototype.getFormMeta = function(entity) {
        throw 'Implement me!';
    };
    

    AbstractOverview.prototype.updateEntity = function(entity){
        var me = this;
        Rest.doPost('admin/' + this.url + '/update', entity).then(function(r){
            if(r === true) {
                me.update().then(function(r){
                    me.grid.data = r.data;
                    me.grid.update()
                });
                Engine.console(me.getUpdateMessage(entity));
                me.editModal.hide();
            } else {
                Engine.console(me.getUpdateFail())
            }
        })
    };

    AbstractOverview.prototype.renderControl = function(data){
        var me = this;
        return Dom.el('div', null, [
            Dom.el('button', {class: 'info small', onclick: function(){
                me.showEditForm(data);
            }}, 'Edit'),
            Dom.el('button', {class: 'danger small', onclick: function(){
                if(confirm(me.getDeleteMessage(data))) {
                    Rest.doDelete('admin/' + me.url + '/delete', data).then(function(entity){
                        Engine.console(me.getAfterDeleteMessage(entity));
                        me.grid.pagination.refresh();
                    })
                }
            }}, 'Delete')
        ]);
    };

    AbstractOverview.prototype.update = function(page) {
        if(page) {
            this.page = page;
        }
        return Rest.doGet(
            'admin/' + this.url + '/get-list?page=' + (this.page - 1) + "&size=20"
        ).then(function(pageable){
            return {
                data: pageable.content
            }
        });
    };

    AbstractOverview.prototype.showEditForm = function(data) {
        var me = this;
        var form = new GenericForm(
            data,
            this.getFormMeta(),
            function(entity){
                me.updateEntity(entity)
            }
        );
        me.editModal.setContent(form.container);
        me.editModal.show();
    };
    return AbstractOverview;
});