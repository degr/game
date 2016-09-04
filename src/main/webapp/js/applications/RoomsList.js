Engine.define('RoomsList', ['MainMenu', 'RoomsChat', 'Dom', 'Pagination', 'Rest', 'Controls', 'KeyboardUtils'], 
    (function (MainMenu, RoomsChat, Dom, Pagination, Rest, Controls, KeyboardUtils) {
    
    function RoomsList(context, placeApplication) {
        
        this.TITLE = 'Room List';
        this.URL = 'room-list';
        
        this.container = null;
        this.content = Dom.el('ul', {'class': 'games'});
        this.pageNumber = 1;
        this.mapsLoaded = false;
        this.mapBackground = '#ffffff';
        this.mapForeground = '#000000';
        this.mapWidth = 200;
        this.playGround = null;
        this.chat = null;
        this.placeApplication = placeApplication;
        /**
         * @var RoomChat
         */
        this.roomsChat = new RoomsChat(context);
        this.mainMenu = new MainMenu(context, placeApplication);
        
        var me = this;

        var pagination = new Pagination(function (page) {
            me.openPage(page)
        }, this.pageNumber);

        var info = Dom.el('div', 'clearfix', [
            Dom.el('div', "hint", this.buildMovementHint()),
            Dom.el('div', "hint", 'Customize your controls in game, right-bottom corner, gear icon')
        ]);

        this.container = Dom.el(
            'div',
            {'class': 'games-list'},
            [
                this.mainMenu.container,
                Dom.el('h1', null, 'Select game to play'),
                info,
                pagination.container,
                this.roomsChat.container,
                this.content
            ]
        );
    }

    RoomsList.prototype.buildMovementHint = function () {
        var out = '';
        var buttons = ['left', 'top', 'right', 'bottom'];
        for(var i = 0; i < buttons.length; i++ ) {
            var key = Controls[buttons[i]];
            out += KeyboardUtils.translateButton(key);
        }
        return out + ' for movement, 1-7 for weapon switch, mouse click for shoot'; 
    };
    RoomsList.prototype.openPage = function (page) {
        this.pageNumber = page;
        var me = this;
        Rest.doGet("rooms/list/" + page + "/15").then(function (games) {
            me.update(games);
        });
    };
    RoomsList.prototype.update = function (rooms) {
        if (rooms.length) {
            this.content.innerHTML = '';
            for (var i = 0; i < rooms.length; i++) {
                this.content.appendChild(this.buildRoom(rooms[i]));
            }
        } else {
            this.content.innerHTML = 'No available rooms. <br>' + (this.pageNumber === 1 ?
                    'Try create your own game, or wait for a while.' :
                    'Try to open previous page');
        }
    };
    RoomsList.prototype.buildRoom = function (room) {
        var descriptionLink = Dom.el('a', {'href': '#'});
        var me = this;
        var clb = function (e) {
            e.preventDefault();
            if (room.personsCount == room.totalSpace) {
                if (!confirm("This room is full. You can join as spectator only. Continue?")) {
                    return;
                }
                me.chat.update(0, "You joined as SPECTATOR");
            }
            me.placeApplication('PlayGround', {joinGame: {map: room.map, roomId: room.id}});
        };
        descriptionLink.onclick = clb;
        descriptionLink.innerText = room.description;

        var titleLink = Dom.el('a', {'href': '#'});
        titleLink.onclick = clb;
        titleLink.innerText = room.id + " " + (room.name ? room.name : 'unnamed room') + " (" + room.personsCount + "/" +
            room.totalSpace + ")";
        var description = Dom.el('p', null, descriptionLink);
        var name = Dom.el('h3', null, titleLink);

        var map = this.doSimpleMap(room.map.zones, room.map.x, room.map.y);
        return Dom.el('li', null, [name, map, description]);
    };
    RoomsList.prototype.doSimpleMap = function (zones, x, y) {
        var out = Dom.el('canvas', {width: x, height: y});
        var context = out.getContext('2d');
        context.fillStyle = this.mapBackground;
        context.fillRect(0, 0, x, y);
        context.fillStyle = this.mapForeground;
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
        out.setAttribute('style', 'border: 1px solid ' + this.mapForeground +
            ';width: ' + this.mapWidth + 'px; height: ' +
            (y / x * this.mapWidth) + 'px');
        return out;
    };

    RoomsList.prototype.beforeOpen = function () {
        if (!this.mapsLoaded) {
            this.openPage(this.pageNumber);
        }
        this.roomsChat.start();
    };
    RoomsList.prototype.beforeClose = function () {
        this.roomsChat.stop();
    };

    return RoomsList;
}));  