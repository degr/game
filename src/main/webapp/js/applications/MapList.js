var MapList = {
    container: null,
    content: null,
    pageNumber: 1,
    mapsLoaded: false,
    beforeOpen: function() {
        if(!MapList.mapsLoaded) {
            MapList.openPage(MapList.pageNumber);
        }
    },
    init: function() {
        var controlPanel = new Pagination(MapList.openPage, MapList.pageNumber);
        MapList.content = Dom.el('div');
        var joinGame = Dom.el('input', {type:'button', value: 'Join to existing room'});
        joinGame.onclick = function(){Dispatcher.placeApplication('RoomsList')};
        var createMap = Dom.el('input', {type:'button', value: 'Create new map'});
        createMap.onclick = function(){Dispatcher.placeApplication('MapEditor')};
        MapList.container = Dom.el(
            'div',
            {'class': 'map-list'},
            [Dom.el('h1', null, 'Select map to create game'), joinGame, createMap, controlPanel.container, MapList.content]
        );
    },
    openPage: function(page) {
        MapList.pageNumber = page;
        Rest.doGet("server/map/list/" + page + "/15").then(function(maps) {
            MapList.update(maps);
        });
    },
    update: function(maps) {
        alert('maps update!');
    }
};