Engine.define('UrlResolver', {
    regex: /(^\/)|(\/$)/,
    findApplication: function () {
        var path = document.location.pathname;
        path = path.replace(this.regex, '');
        switch (path) {
            case 'map-list':
                return 'MapList';
            case 'map-editor':
                return 'MapEditor';
            case 'room-list':
                return 'RoomsList';
            default:
                return 'Greetings';
        }
    }
});