Engine.define('MapList', ['MainMenu', 'StringUtils', 'Dom', 'Pagination', 'Rest'],
    (function (MainMenu, StringUtils, Dom, Pagination, Rest) {
    
    
    function MapList(context, placeApplication) {
        this.TITLE = 'Map List';
        this.URL = 'map-list';
        
        this.container = null;
        this.content = Dom.el('div', 'maps');
        this.pageNumber = 1;
        this.mapsLoaded = false;
        this.mapBackground = '#ffffff';
        this.mapForeground = '#000000';
        this.mapWidth = 200;
        this.placeApplication = placeApplication;

        this.mainMenu = new MainMenu(context, placeApplication);
        
        var me = this;
        var pagination = new Pagination(
            function(page){me.openPage(page)},
            this.pageNumber
        );

        this.container = Dom.el(
            'div',
            {'class': 'map-list'},
            [
                this.mainMenu.container,
                Dom.el('h1', null, 'Select map to create game'),
                pagination.container, this.content]
        );
    }
    MapList.prototype.beforeOpen = function () {
        if (!this.mapsLoaded) {
            this.openPage(this.pageNumber);
        }
    };
    MapList.prototype.openPage = function (page) {
        this.pageNumber = page;
        var me = this;
        Rest.doGet("map/list/" + page + "/15").then(function (maps) {
            me.update(maps);
        });
    };
    MapList.prototype.update = function (maps) {
        this.content.innerHTML = '';
        for (var i = 0; i < maps.length; i++) {
            this.content.appendChild(this.buildMap(maps[i]));
        }
    };
    MapList.prototype.buildMap = function (map) {
        var me = this;
        var clb = function (e) {
            e.preventDefault();
            var name = prompt(
                "You want to create game on map " + map.name + ". \n Please specify game name:",
                "unnamed-" + StringUtils.unique()
            );
            if (name !== null) {
                me.placeApplication("PlayGround", {createGame: {name: name, map: map}});
            }
        };
        var descriptionLink;
        if (map.description) {
            descriptionLink = Dom.el('a', {href: '#', onclick: clb});
            descriptionLink.innerText = map.description || '';
        } else {
            descriptionLink = null;
        }
        var titleLink = Dom.el('a', {href: '#', onclick: clb});
        
        titleLink.innerText = map.id + " " + (map.name ? map.name : 'unnamed map') +
            " size: " + map.x + "x" + map.y + " (" + map.maxPlayers + " players)";
        var description = Dom.el('p', null, descriptionLink);
        var name = Dom.el('h3', null, titleLink);

        var mapDom = this.doSimpleMap(map.zones, map.x, map.y);
        return Dom.el('li', null, [name, mapDom, description]);
    };
    MapList.prototype.doSimpleMap = function (zones, x, y) {
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
    
    return MapList;
}));