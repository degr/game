var RoomsList = {
    container: null,
    content: null,
    pageNumber: 1,
    mapsLoaded: false,
    mapBackground: '#ffffff',
    mapForeground: '#000000',
    mapWidth: 200,
    rooms: [],
    selectedRoomId: -1,//@todo unused
    beforeOpen: function() {
        if(!RoomsList.mapsLoaded) {
            RoomsList.openPage(RoomsList.pageNumber);
        }
    },
    init: function() {
        var controlPanel = new Pagination(RoomsList.openPage, RoomsList.pageNumber);
        var createGame = Dom.el('input', {type:'button', value: 'Create room'});
        createGame.onclick = function(){Dispatcher.placeApplication('MapList')};
        RoomsList.content = Dom.el('ul', {'class': 'games'});
        RoomsList.container = Dom.el(
            'div',
            {'class': 'games-list'},
            [Dom.el('h1', null, 'Select game to play'), createGame, controlPanel.container, RoomsList.content]
        );
    },
    openPage: function(page) {
        RoomsList.pageNumber = page;
        Rest.doGet("rooms/list/" + page + "/15").then(function(games) {
            RoomsList.update(games);
        });
    },
    update: function(rooms) {
        RoomsList.rooms = rooms;
        if(rooms.length) {
            RoomsList.content.innerHTML = '';
            for (var i = 0; i < rooms.length; i++) {
                RoomsList.content.appendChild(RoomsList.buildRoom(rooms[i]));
            }
        } else {
            RoomsList.content.innerHTML = 'No available rooms. <br>' + (RoomsList.pageNumber === 1 ? 
                    'Try create your own game, or wait for a while.' :
                    'Try to open previous page');
        }
    },
    buildRoom: function(room) {
        var descriptionLink = Dom.el('a', {'href':'#'});
        var clb = function(e){
            e.preventDefault();
            Dispatcher.placeApplication('PlayGround');
            PlayGround.joinGame(room.map, room.id);
        };
        descriptionLink.onclick = clb;
        descriptionLink.innerText = room.description;

        var titleLink = Dom.el('a', {'href':'#'});
        titleLink.onclick = clb;
        titleLink.innerText = room.id + " " + (room.name ? room.name : 'unnamed room') + " (" + room.personsCount+ "/" +
            room.totalSpace+ ")";
        var description = Dom.el('p', null, descriptionLink);
        var name = Dom.el('h3', null, titleLink);
        
        var map = RoomsList.doSimpleMap(room.map.zones, room.map.x, room.map.y);
        return Dom.el('li', null, [name, map, description]);
    },
    doSimpleMap: function(zones, x, y) {
        var out = Dom.el('canvas', {width: x, height: y});
        var context = out.getContext('2d');
        context.fillStyle = RoomsList.mapBackground;
        context.fillRect(0, 0, x, y);
        context.fillStyle = RoomsList.mapForeground;
        if(zones) {
            for (var i = 0; i < zones.length; i++) {
                var zone = zones[i];
                if (!zone.passable) {
                    context.fillRect(zone.x, zone.y, zone.width, zone.height);
                }
            }
        }
        out.setAttribute('style', 'border: 1px solid '+RoomsList.mapForeground+
            ';width: '+RoomsList.mapWidth+'px; height: ' +
            (y/x * RoomsList.mapWidth) + 'px');
        return out;
    }
};  