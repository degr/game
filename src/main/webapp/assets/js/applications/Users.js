Engine.define('Users', ['AbstractOverview'] , function(){

    var AbstractOverview = Engine.require('AbstractOverview');

    function Users(context) {
        AbstractOverview.apply(this, arguments);
    }
    Users.prototype = Object.create(AbstractOverview.prototype);


    Users.prototype.getColumns = function() {
        var me = this;
        return [
            {name: 'username'},
            {name: 'password'},
            {name: 'authority'},
            {name: 'id', title: 'Control', render: function(n, data){
                return me.renderControl(data)
            }}
        ];
    };
    Users.prototype.getEntityName = function() {
        return 'user';
    };
    Users.prototype.getUpdateMessage = function(entity) {
        return "User was updated";
    };
    Users.prototype.getUpdateFail = function(entity) {
        return "Can't update user. May be name is not unique.";
    };
    Users.prototype.getDeleteMessage = function(entity) {
        return "Are you sure to delete " +entity.username+"?";
    };
    Users.prototype.getAfterDeleteMessage = function(entity) {
        return 'User was deleted';
    };
    Users.prototype.getFormMeta = function(entity) {
        return {
            id: {ignore: true},
            new: {ignore: true}
        };
    };
    return Users;
});