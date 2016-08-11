Engine.define('RoomsList', (function () {
    var RoomsChat = Engine.require('RoomsChat');
    var Dom = Engine.require('Dom');
    var Pagination = Engine.require('Pagination');
    var Rest = Engine.require('Rest');
    
    
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
        dispatcher: null,
        playGround: null,
        chat: null,
        beforeOpen: function () {
            if (!RoomsList.mapsLoaded) {
                RoomsList.openPage(RoomsList.pageNumber);
            }
            RoomsChat.setActive(true);
        },
        beforeClose: function () {
            RoomsChat.setActive(false);
        },

        init: function () {
            RoomsChat.init();


            var controlPanel = new Pagination(RoomsList.openPage, RoomsList.pageNumber);
            var createGame = Dom.el('input', {type: 'button', value: 'Create room'});
            createGame.onclick = function () {
                RoomsList.dispatcher.placeApplication('MapList')
            };
            var info = [
                Dom.el('div', null, 'ASDW for movement, 1-7 for weapon switch, mouse click for shoot'),
                Dom.el('div', null, 'Customize your controls in game, right-bottom corner, gear icon')];
            RoomsList.content = Dom.el('ul', {'class': 'games'});
            RoomsList.container = Dom.el(
                'div',
                {'class': 'games-list'},
                [
                    Dom.el('h1', null, 'Select game to play'),
                    info,
                    createGame, controlPanel.container,
                    RoomsChat.container,
                    RoomsList.content]
            );
        },
        openPage: function (page) {
            RoomsList.pageNumber = page;
            Rest.doGet("rooms/list/" + page + "/15").then(function (games) {
                RoomsList.update(games);
            });
        },
        update: function (rooms) {
            RoomsList.rooms = rooms;
            if (rooms.length) {
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
        buildRoom: function (room) {
            var descriptionLink = Dom.el('a', {'href': '#'});
            var clb = function (e) {
                e.preventDefault();
                if (room.personsCount == room.totalSpace) {
                    if (!confirm("This room is full. You can join as spectator only. Continue?")) {
                        return;
                    }
                    this.chat.update(0, "You joined as SPECTATOR");
                }
                RoomsList.dispatcher.placeApplication('PlayGround');
                RoomsList.playGround.joinGame(room.map, room.id);
            };
            descriptionLink.onclick = clb;
            descriptionLink.innerText = room.description;

            var titleLink = Dom.el('a', {'href': '#'});
            titleLink.onclick = clb;
            titleLink.innerText = room.id + " " + (room.name ? room.name : 'unnamed room') + " (" + room.personsCount + "/" +
                room.totalSpace + ")";
            var description = Dom.el('p', null, descriptionLink);
            var name = Dom.el('h3', null, titleLink);

            var map = RoomsList.doSimpleMap(room.map.zones, room.map.x, room.map.y);
            return Dom.el('li', null, [name, map, description]);
        },
        doSimpleMap: function (zones, x, y) {
            var out = Dom.el('canvas', {width: x, height: y});
            var context = out.getContext('2d');
            context.fillStyle = RoomsList.mapBackground;
            context.fillRect(0, 0, x, y);
            context.fillStyle = RoomsList.mapForeground;
            if (zones) {
                for (var i = 0; i < zones.length; i++) {
                    var zone = zones[i];
                    if (!zone.passable) {
                        context.save();
                        if(zone.angle) {
                            context.translate(zone.x + zone.width / 2, zone.y + zone.height / 2);
                            context.rotate(zone.angle);
                            context.fillRect(-zone.width / 2, -zone.height/2, zone.width, zone.height);
                            context.restore();
                        } else {
                            context.fillRect(zone.x, zone.y, zone.width, zone.height);
                        }
                        context.restore();
                    }
                }
            }
            out.setAttribute('style', 'border: 1px solid ' + RoomsList.mapForeground +
                ';width: ' + RoomsList.mapWidth + 'px; height: ' +
                (y / x * RoomsList.mapWidth) + 'px');
            return out;
        }
    };
    return RoomsList;
})());  