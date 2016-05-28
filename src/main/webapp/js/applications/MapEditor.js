var MapEditor = {
    container: null,
    init: function () {
        MapEditor.console = Dom.el('p', {id: 'editor_console'});
        var labelX = Dom.el('label', {'for': 'x'}, 'Map X');
        var inputX = Dom.el('input', {type: 'text', name: 'x', value: MapEditor.x});
        inputX.onkeyup = function () {
            MapEditor.updateDimension(this, true);
            MapEditor.changeMapSize()
        };
        var labelY = Dom.el('label', {'for': 'y'}, 'Map Y');
        var inputY = Dom.el('input', {type: 'text', name: 'y', value: MapEditor.y});
        inputY.onkeyup = function () {
            MapEditor.updateDimension(this, false);
            MapEditor.changeMapSize()
        };
        var mapName = Dom.el('input', {name: 'map_name', placeholder: 'Map name'});
        var mapNameEror = Dom.el('span', {'style': 'color: red'});
        mapName.onkeyup = function (e) {
            MapEditor.checkMapName(this.value, mapNameEror);
        };
        var goBack = Dom.el('input', {type: 'button', value: 'Create Game'});
        goBack.onclick = function () {
            var c = confirm("Are you sure to leave this page?");
            if (c) {
                Dispatcher.placeApplication('MapList');
            }
        };
        var mapControl = Dom.el('form', null, [
            labelX, inputX, mapName, mapNameEror,
            Dom.el('br'),
            labelY, inputY, Dom.el('input', {type: 'submit', value: 'Save map'}), goBack
        ]);
        mapControl.onsubmit = function (e) {
            MapEditor.onSubmit(e);
        };

        MapEditor.zonesButtons = Dom.el('div', {'class': 'zones'});
        MapEditor.zoneTypeHolder = Dom.el('div', {'class': 'mounted'});
        MapEditor.map = Dom.el('canvas', {width: MapEditor.x, height: MapEditor.y});
        MapEditor.container = Dom.el('div', {'class': 'editor'}, [
            MapEditor.console, mapControl, MapEditor.zonesButtons, MapEditor.zoneTypeHolder, MapEditor.map
        ]);
        MapEditor.map.onclick = function (e) {
            MapEditor.onClick(e)
        };
        MapEditor.context = MapEditor.map.getContext('2d');
    },
    x: 640,
    y: 480,
    map: null,
    mapName: '',
    console: null,
    objectsLoaded: false,
    mounting: {
        type: null,
        pointA: null,
        pointB: null,
        highlight: false
    },
    context: null,
    mounted: null,
    mountedObjects: [],
    zonesButtons: null,
    checkMapName: function (name, mapNameEror) {
        MapEditor.mapName = name;
        if (!name) {
            mapNameEror.innerHTML = "Please write map name."
        } else {
            Rest.doPost('map/name-empty', name).then(function (response) {
                if (response !== true) {
                    mapNameEror.innerHTML = "Map with this name already exist";
                }
            })
        }
    },
    beforeOpen: function () {
        MapEditor.changeMapSize();
        if (!MapEditor.objectsLoaded) {
            MapEditor.objectsLoaded = true;
            MapEditor.loadObjects();
        }
    },
    onSubmit: function (e) {
        e.preventDefault();
        var zones = [];
        for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
            var zone = MapEditor.mountedObjects[i];
            var rect = MapEditor.doRectangle(zone);
            rect.type = zone.type;
            zones.push(rect);
        }
        var map = {
            name: MapEditor.mapName,
            x: MapEditor.x,
            y: MapEditor.y,
            zonesDto: zones
        };
        Rest.doPost('map/save', map).then(function (response) {
            if (response != -1) {
                alert('Map was saved');
            } else {
                alert("Can't save map due unknown reasons. May be name is not unique, or there is no respawn points.")
            }
        })
    },
    onClick: function (e) {
        var type = MapEditor.mounting.type;
        if (type) {
            var point = {x: e.offsetX, y: e.offsetY};
            var zone = MapEditor.zones[type];
            var finishMount = function () {
                MapEditor.mountedObjects.push(MapEditor.mounting);
                MapEditor.appendControlButton(MapEditor.mounting);
                MapEditor.mounting = {
                    type: null,
                    pointA: null,
                    pointB: null,
                    highlight: false
                };
                MapEditor.render();
                MapEditor.write("Object " + type + " was mounted.");
            };
            if (!MapEditor.mounting.pointA) {

                if (zone.staticSize) {
                    point.x = point.x - zone.width / 2;
                    point.y = point.y - zone.height / 2;
                    MapEditor.mounting.pointA = point;
                    MapEditor.mounting.pointB = {x: point.x + zone.width, y: point.y + zone.height};
                    finishMount();
                } else {
                    MapEditor.mounting.pointA = point;
                    MapEditor.write("Set right-bottom corner of " + type);
                }
            } else {
                MapEditor.mounting.pointB = point;
                finishMount();
            }
        }
    },
    render: function () {
        var context = MapEditor.context;
        context.clearRect(0, 0, MapEditor.x, MapEditor.y);


        for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
            context.beginPath();
            var zone = MapEditor.mountedObjects[i];
            var rect = MapEditor.doRectangle(zone);
            if (zone.highlight) {
                context.strokeStyle = "#EA0013";
                context.fillStyle = '#EA0013';
            } else {
                context.strokeStyle = "#5E354F";
                context.fillStyle = '#5E354F';
            }
            if (zone.type != 'wall') {
                context.strokeText(zone.type, rect.x + 3, rect.y + 20, rect.width - 6);
                context.rect(rect.x, rect.y, rect.width, rect.height);
            } else {
                context.fillRect(rect.x, rect.y, rect.width, rect.height)
            }
            context.stroke();
        }
    },
    doRectangle: function (zone) {
        var out = {
            x: null, y: null, width: null, height: null
        };
        var p1 = zone.pointA;
        var p2 = zone.pointB;
        if (p1.x < p2.x) {
            out.x = p1.x;
            out.width = p2.x - p1.x;
        } else {
            out.x = p2.x;
            out.width = p1.x - p2.x;
        }
        if (p1.y < p2.y) {
            out.y = p1.y;
            out.height = p2.y - p1.y
        } else {
            out.y = p2.y;
            out.height = p1.y - p2.y;
        }
        return out;
    },
    loadObjects: function () {
        Rest.doGet('zones/list').then(function (zones) {
            MapEditor.zones = {};
            MapEditor.zonesButtons.innerHTML = '';
            var doInput = function (zone) {
                var name = zone.type;
                var input = Dom.el('input', {
                    type: 'button',
                    'class': 'item item-' + name,
                    value: name
                });
                input.onclick = function () {
                    MapEditor.mount(name)
                };
                return input;
            };
            for (var i = 0; i < zones.length; i++) {
                var zone = zones[i];
                MapEditor.zones[zone.type] = zone;
                MapEditor.zonesButtons.appendChild(doInput(zone));
            }
        });
    },
    changeMapSize: function () {
        var element = MapEditor.getMap();
        Dom.update(element, {width: MapEditor.x, height: MapEditor.y});
        MapEditor.render()
    },
    updateDimension: function (input, isX) {
        var newValue = input.value;
        var newNumberValue = parseInt(newValue);
        if (newValue == newNumberValue) {
            if (isX) {
                MapEditor.x = newNumberValue;
            } else {
                MapEditor.y = newNumberValue;
            }
        } else {
            if (isX) {
                input.value = MapEditor.x;
            } else {
                input.value = MapEditor.y;
            }
        }

    },
    getMap: function () {
        return MapEditor.map;
    },
    mount: function (type) {
        MapEditor.mounting.type = type;
        MapEditor.mounting.pointA = null;
        MapEditor.mounting.pointB = null;
        MapEditor.write("Select left - top corner for " + type);
    },
    write: function (text) {
        MapEditor.getConsole().innerText = text;
    },
    getConsole: function () {
        return MapEditor.console;
    },
    appendControlButton: function (obj) {
        var ts = new Date().getTime();
        var type = obj.type;
        var zone = MapEditor.zones[type];
        var isStaticSize = zone.staticSize;
        var out = Dom.el('div');
        var createInput = function (point, pointB) {
            var labelX = Dom.el('label', {'for': 'x_' + ts}, 'x');
            var x = Dom.el('input', {type: 'text', id: 'x_' + ts, value: point.x});
            x.onkeyup = function () {
                point.x = parseInt(this.value);
                if (isStaticSize && pointB) {
                    pointB.x = point.x + zone.width
                }
                MapEditor.render();
            };

            var labelY = Dom.el('label', {'for': 'y_' + ts}, 'y');
            var y = Dom.el('input', {type: 'text', id: 'y_' + ts, value: point.y});
            y.onkeyup = function () {
                point.y = parseInt(this.value);
                if (isStaticSize && pointB) {
                    pointB.y = point.y + zone.height
                }
                MapEditor.render();
            };
            return Dom.el('div', {'class': 'coordinates'}, [labelX, x, labelY, y]);
        };
        var input1 = createInput(obj.pointA, obj.pointB);
        var input2 = null;
        if (!isStaticSize) {
            input2 = createInput(obj.pointB);
        }
        var delButton = document.createElement('input');
        delButton.type = 'button';
        delButton.value = 'delete';
        delButton.onclick = function () {
            for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
                if (MapEditor.mountedObjects[i] == obj) {
                    MapEditor.mountedObjects.splice(i, 1);
                    out.remove();
                    MapEditor.render();
                }
            }
        };
        var highlight = Dom.el('input', {type: 'checkbox', id: 'h_' + ts});
        highlight.onchange = function (e) {
            obj.highlight = this.checked;
            MapEditor.render();
        };
        var highLightLabel = Dom.el('label', {'for': 'h_' + ts}, [highlight, 'highlight']);
        var label = Dom.el('p', null, [type, delButton, highLightLabel]);
        Dom.append(out, [label, input1, input2]);
        if (MapEditor.mountedObjects.length === 0) {
            MapEditor.zoneTypeHolder.appendChild(out);
        } else {
            MapEditor.zoneTypeHolder.insertBefore(out, MapEditor.zoneTypeHolder.children[0])
        }
    }
};