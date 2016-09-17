Engine.define('Maps', ['AbstractOverview'], function(){

    var AbstractOverview = Engine.require('AbstractOverview');

    function Maps(context, placeApplication) {
        AbstractOverview.apply(this, arguments);
    }
    Maps.prototype = Object.create(AbstractOverview.prototype);

    Maps.prototype.getColumns = function() {
        var me = this;
        return  [
            {name: 'title'},
            {name: 'gameType'},
            {name: 'mapHash'},
            {name: 'maxPlayers'},
            {name: 'rating'},
            {name: 'x', title: 'Width'},
            {name: 'y', title: 'Height'},
            {name: 'id', title: 'Control', render: function(n, data){
                return me.renderControl(data)
            }}
        ];
    };
    Maps.prototype.getEntityName = function() {
        return 'map';
    };
    Maps.prototype.getUpdateMessage = function(entity) {
        return "Map was updated";
    };
    Maps.prototype.getUpdateFail = function(entity) {
        return "Can't update map. May be title is not unique.";
    };
    Maps.prototype.getDeleteMessage = function(entity) {
        return "Are you sure to delete " +entity.title+"?";
    };
    Maps.prototype.getAfterDeleteMessage = function(entity) {
        return 'Map was deleted';
    };
    Maps.prototype.getFormMeta = function(entity) {
        return {
            id: {ignore: true},
            new: {ignore: true}
        };
    };
    return Maps;
});