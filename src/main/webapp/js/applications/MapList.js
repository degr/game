Engine.define('MapList', (function () {

    var Dom = Engine.require('Dom');
    var Pagination = Engine.require('Pagination');
    var Rest = Engine.require('Rest');
    var StringUtils = Engine.require('StringUtils');
    
    var MapList = {
        container: null,
        content: null,
        pageNumber: 1,
        mapsLoaded: false,
        mapBackground: '#ffffff',
        mapForeground: '#000000',
        mapWidth: 200,
        dispatcher: null,
        playGround: null,
        beforeOpen: function () {
            if (!MapList.mapsLoaded) {
                MapList.openPage(MapList.pageNumber);
            }
        },
        init: function () {
            var controlPanel = new Pagination(MapList.openPage, MapList.pageNumber);
            MapList.content = Dom.el('div', 'maps');
            var joinGame = Dom.el('input', {type: 'button', value: 'Join to existing room'});
            joinGame.onclick = function () {
                MapList.dispatcher.placeApplication('RoomsList')
            };
            var createMap = Dom.el('input', {type: 'button', value: 'Create new map'});
            createMap.onclick = function () {
                MapList.dispatcher.placeApplication('MapEditor')
            };
            MapList.container = Dom.el(
                'div',
                {'class': 'map-list'},
                [Dom.el('h1', null, 'Select map to create game'), joinGame, createMap, controlPanel.container, MapList.content]
            );
        },
        openPage: function (page) {
            MapList.pageNumber = page;
            Rest.doGet("map/list/" + page + "/15").then(function (maps) {
                MapList.update(maps);
            });
        },
        update: function (maps) {
            MapList.content.innerHTML = '';
            for (var i = 0; i < maps.length; i++) {
                MapList.content.appendChild(MapList.buildMap(maps[i]));
            }
        },
        buildMap: function (map) {
            var clb = function (e) {
                e.preventDefault();
                var name = prompt(
                    "You want to create game on map " + map.name + ". \n Please specify game name:",
                    "unnamed-" + StringUtils.unique()
                );
                if (name !== null) {
                    MapList.dispatcher.placeApplication("PlayGround");
                    MapList.playGround.createGame(name, map);
                }
            };
            var descriptionLink;
            if (map.description) {
                descriptionLink = Dom.el('a', {'href': '#'});
                descriptionLink.onclick = clb;
                descriptionLink.innerText = map.description || '';
            } else {
                descriptionLink = null;
            }
            var titleLink = Dom.el('a', {'href': '#'});
            titleLink.onclick = clb;
            titleLink.innerText = map.id + " " + (map.name ? map.name : 'unnamed map') +
                " size: " + map.x + "x" + map.y + " (" + map.maxPlayers + " players)";
            var description = Dom.el('p', null, descriptionLink);
            var name = Dom.el('h3', null, titleLink);

            var mapDom = MapList.doSimpleMap(map.zones, map.x, map.y);
            return Dom.el('li', null, [name, mapDom, description]);
        },
        doSimpleMap: function (zones, x, y) {
            var out = Dom.el('canvas', {width: x, height: y});
            var context = out.getContext('2d');
            context.fillStyle = MapList.mapBackground;
            context.fillRect(0, 0, x, y);
            context.fillStyle = MapList.mapForeground;
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
            out.setAttribute('style', 'border: 1px solid ' + MapList.mapForeground +
                ';width: ' + MapList.mapWidth + 'px; height: ' +
                (y / x * MapList.mapWidth) + 'px');
            return out;
        }
    };
    return MapList
})());