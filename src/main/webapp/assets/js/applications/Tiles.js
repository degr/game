Engine.define('Tiles', ['AbstractOverview'], function(){

    var AbstractOverview = Engine.require('AbstractOverview');
    var Dom = Engine.require('Dom');

    function Tiles(context) {
        AbstractOverview.apply(this, arguments);
    }
    Tiles.prototype = Object.create(AbstractOverview.prototype);

    Tiles.prototype.getColumns = function() {
        var me = this;
        return  [
            {name: 'title'},
            {name: 'image', render: function(v){return Dom.el('button', {class: 'info small', onclick: function(){
                me.editModal.setContent(Dom.el('img', {style: 'display: block;width: 100%;', src: 'upload.images/zones/' + v}));
                me.editModal.show();
            }},'Show')}},
            {name: 'size', title: 'Size', render: function(v, data){
                return data.width + 'x' + data.height;
            }},
            {name: 'width'},
            {name: 'tileset', render: function (v, data) {
                var opts = {type: 'radio', name: "tile_" + data.id, disabled: true};
                if(v) {
                    opts.checked = true;
                }
                return Dom.el('input', opts)
            }},
            {name: 'id', title: 'Control', render: function(n, data){
                return me.renderControl(data)
            }}
        ];
    };
    Tiles.prototype.getEntityName = function() {
        return 'tile';
    };
    Tiles.prototype.getUpdateMessage = function(entity) {
        return "Tile was updated";
    };
    Tiles.prototype.getUpdateFail = function(entity) {
        return "Can't update tile.";
    };
    Tiles.prototype.getDeleteMessage = function(entity) {
        return "Are you sure to delete this tile?";
    };
    Tiles.prototype.getAfterDeleteMessage = function(entity) {
        return 'Tile was deleted';
    };
    Tiles.prototype.getFormMeta = function(entity) {
        return {
            id: {ignore: true},
            new: {ignore: true}
        };
    };
    return Tiles;
});