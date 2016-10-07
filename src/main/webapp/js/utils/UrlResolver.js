Engine.define('UrlResolver', {
    regex: /(^\/)|(\/$)/,
    strategy: 'path',//one of the following: [path, hash]
    findApplication: function () {
        var path = this.strategy === 'path' ? document.location.pathname : document.location.hash;
        path = path.replace(this.regex, '');
        switch (path) {
            case 'map-list':
                return 'MapList';
            case 'map-editor':
                return 'MapEditor';
            case 'room-list':
                return 'RoomsList';
            case 'account':
                return 'Account';
            case 'logout':
                return 'Logout';
            case 'users':
                return 'Users';
            case 'maps':
                return 'Maps';
            case 'tiles':
                return 'Tiles';
            default:
                return 'Greetings';
        }
    }
});