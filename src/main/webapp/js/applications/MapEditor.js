Engine.define('MapEditor', (function () {

    var Dom = Engine.require('Dom');
    var CustomTiles = Engine.require('CustomTiles');
    var DomComponents = Engine.require('DomComponents');
    var Rest = Engine.require('Rest');
    var Weapons = Engine.require('Weapons');

    var MapEditor = {
        container: null,
        gridSize: 1,
        inputX: null,
        inputY: null,
        inputName: null,
        filterValue: '',
        customTiles: null,
        dispatcher: null,
        playGround: null,
        weapons: Weapons.getInstance(),
        init: function () {
            this.customTiles = new CustomTiles(function () {
                MapEditor.loadObjects()
            });

            MapEditor.console = Dom.el('p', {id: 'editor_console'});


            MapEditor.zonesButtons = Dom.el('div', {'class': 'zones panel'});
            DomComponents.doModal(MapEditor.zonesButtons);
            MapEditor.zoneTypeHolder = Dom.el('div', {'class': 'mounted'});
            var filter = Dom.el('input', {type: 'text', placeholder: 'Filter by zone name'});
            filter.onkeyup = function () {
                MapEditor.filterValue = filter.value.toLowerCase();
                MapEditor.updateMountedObjects();
            };
            var zoneTypeWrapper = Dom.el('div', 'mounted-wrapper panel', [filter, MapEditor.zoneTypeHolder]);
            DomComponents.doModal(zoneTypeWrapper);
            MapEditor.map = Dom.el('canvas', {width: MapEditor.x, height: MapEditor.y});
            MapEditor.container = Dom.el('div', {'class': 'editor'}, [
                this.customTiles.container,
                MapEditor.doMapControl(), MapEditor.zonesButtons, zoneTypeWrapper, Dom.el('div', 'map-editor-wrapper', MapEditor.map)
            ]);
            MapEditor.map.onclick = function (e) {
                MapEditor.onClick(e)
            };
            MapEditor.map.onmousedown = function (e) {
                MapEditor.onMouseDown(e)
            };
            MapEditor.map.onmouseup = function (e) {
                MapEditor.onMouseUp(e);
            };
            MapEditor.map.onmousemove = function (e) {
                MapEditor.onMouseMove(e);
            };
            MapEditor.context = MapEditor.map.getContext('2d');
        },
        x: 640,
        y: 480,
        gameType: 'dm',
        map: null,
        mapName: '',
        console: null,
        objectsLoaded: false,
        mounting: {
            type: null,
            pointA: null,
            pointB: null,
            highlight: false,
            customSprite: null,
            angle: 0
        },
        context: null,
        mounted: null,
        mountedObjects: [],
        zonesButtons: null,
        zonesButtonsData: null,
        objectOnResize: null,
        objectOnDrag: null,
        objectOnTurn: null,
        doMapControl: function () {
            var labelX = Dom.el('label', {'for': 'x'}, 'Map X');
            var inputX = Dom.el('input', {type: 'text', name: 'x', value: MapEditor.x});
            inputX.onkeyup = function () {
                MapEditor.updateDimension(this, true);
                MapEditor.changeMapSize();
            };
            MapEditor.inputX = inputX;
            var labelY = Dom.el('label', {'for': 'y'}, 'Map Y');
            var inputY = Dom.el('input', {type: 'text', name: 'y', value: MapEditor.y});
            inputY.onkeyup = function () {
                MapEditor.updateDimension(this, false);
                MapEditor.changeMapSize()
            };
            MapEditor.inputY = inputY;
            var labelGridSize = Dom.el('label', {'for': 'grid_size'}, 'Grid cell size');
            var inputGridSize = Dom.el('input', {type: 'grid_size', name: 'grid_size', value: MapEditor.gridSize});
            inputGridSize.onkeyup = function () {
                MapEditor.updateGridSize(this, false);
                MapEditor.render()
            };
            var mapName = Dom.el('input', {name: 'map_name', placeholder: 'Map name'});
            var mapNameEror = Dom.el('span', {'style': 'color: red'});
            mapName.onkeyup = function () {
                MapEditor.checkMapName(this.value, mapNameEror);
            };
            MapEditor.inputName = mapName;
            var goBack = Dom.el('input', {type: 'button', value: 'Create Game'});
            goBack.onclick = function () {
                var c = confirm("Are you sure to leave this page?");
                if (c) {
                    MapEditor.dispatcher.placeApplication('MapList');
                }
            };
            var createTile = Dom.el('input', {type: 'button', value: 'Create Tile'});
            var me = this;
            createTile.onclick = function () {
                me.customTiles.show();
            };
            var mapControl = Dom.el('form', {'class': 'panel main-control'}, [
                labelX, inputX, mapName, mapNameEror, labelGridSize, inputGridSize,
                Dom.el('br'),
                labelY, inputY,
                MapEditor.doMapType('dm', true, false), MapEditor.doMapType('tdm', false, false), MapEditor.doMapType('ctf', false, true),
                Dom.el('input', {type: 'submit', value: 'Save map'}), createTile, goBack,

                MapEditor.console
            ]);
            mapControl.onsubmit = function (e) {
                MapEditor.onSubmit(e);
            };
            DomComponents.doModal(mapControl);
            return mapControl;
        },
        onMouseDown: function (e) {
            for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
                var obj = MapEditor.mountedObjects[i];

                if (obj.highlight) {

                    var center = MapEditor.getCenter(obj);
                    var rect = MapEditor.doRectangle(obj);
                    var angle = obj.angle;
                    var clientX = e.clientX;
                    var clientY = e.clientY;
                    var controls = MapEditor.getControlRectangles(rect, obj);
                    for (var c = 0; c < controls.resize.length; c++) {
                        var control = controls.resize[c];
                        if (MapEditor.inRectangle(control, clientX, clientY, angle, center)) {
                            var direction;
                            var point;
                            var eventKey;
                            var shift;
                            switch (c) {
                                case 0:
                                    point = 'pointA';
                                    direction = 'y';
                                    eventKey = 'clientY';
                                    shift = 0;
                                    break;
                                case 1:
                                    shift = rect.width;
                                    point = 'pointB';
                                    direction = 'x';
                                    eventKey = 'clientX';
                                    break;
                                case 2:
                                    shift = rect.height;
                                    point = 'pointB';
                                    direction = 'y';
                                    eventKey = 'clientY';
                                    break;
                                default:
                                    shift = 0;
                                    point = 'pointA';
                                    direction = 'x';
                                    eventKey = 'clientX';
                                    break;
                            }
                            MapEditor.objectOnResize = {
                                object: obj,
                                direction: direction,
                                eventKey: eventKey,
                                point: point,
                                shift: shift,
                                x: rect.x,
                                clientX: clientX,
                                y: rect.y,
                                clientY: clientY
                            };
                            return;
                        }
                    }
                    if (MapEditor.inRectangle(controls.turn, clientX, clientY, angle, center)) {
                        MapEditor.objectOnTurn = {
                            object: obj,
                            center: center,
                            angle: MapEditor.getAngle(center.x, center.y, clientX, clientY) - obj.angle
                        };
                        return;
                    }
                    if (MapEditor.inRectangle(rect, clientX, clientY, angle, center)) {
                        MapEditor.objectOnDrag = {
                            object: obj,
                            pointA: {x: obj.pointA.x, y: obj.pointA.y},
                            pointB: {x: obj.pointB.x, y: obj.pointB.y},
                            clientX: clientX,
                            clientY: clientY
                        };
                        return;
                    }
                }
            }
        },
        getAngle: function (x, y, clientX, clientY) {
            var dy = (clientY + window.scrollY) - y;
            var dx = (clientX + window.scrollX) - x;
            return Math.atan2(dy, dx);
        },
        onMouseUp: function (e) {
            var stop = false;
            if (MapEditor.objectOnResize != null) {
                MapEditor.normalizePoints(MapEditor.objectOnResize.object);
                MapEditor.objectOnResize = null;
                stop = true;
            }
            if (MapEditor.objectOnDrag != null) {
                MapEditor.objectOnDrag = null;
                stop = false;//it ok
            }
            if (MapEditor.objectOnTurn != null) {
                MapEditor.objectOnTurn = null;
                stop = true;
            }
            
            if(stop ) {
                MapEditor.stopClick = true;
                e.preventDefault();
                e.stopPropagation();
                e.preventBubble = true;
            }
        },
        onMouseMove: function (e) {
            var resize = MapEditor.objectOnResize;
            if (resize != null) {
                var eventValue = e[resize.eventKey];
                resize.object[resize.point][resize.direction] = resize[resize.direction] + resize.shift + (eventValue - resize[resize.eventKey]);
                resize.object.component.update();
                MapEditor.render();
            } else if (MapEditor.objectOnDrag != null) {
                var clientX = e.clientX;
                var clientY = e.clientY;
                var drag = MapEditor.objectOnDrag;
                drag.object.pointA.x = drag.pointA.x + (clientX - drag.clientX);
                drag.object.pointA.y = drag.pointA.y + (clientY - drag.clientY);
                drag.object.pointB.x = drag.pointB.x + (clientX - drag.clientX);
                drag.object.pointB.y = drag.pointB.y + (clientY - drag.clientY);
                drag.object.component.update();
                MapEditor.render();
            } else if (MapEditor.objectOnTurn != null) {
                var turn = MapEditor.objectOnTurn;
                var angle = MapEditor.getAngle(turn.center.x, turn.center.y, e.clientX, e.clientY);
                turn.object.angle = angle - turn.angle;
                turn.object.component.update();
                MapEditor.render();
            }
        },
        rotatePoint: function (rotationCenter, point, angle) {
            var x = (Math.cos(angle) * (point.x - rotationCenter.x)) -
                    (Math.sin(angle) * (point.y - rotationCenter.y)) +
                    rotationCenter.x,
                y = (Math.sin(angle) * (point.x - rotationCenter.x)) +
                    (Math.cos(angle) * (point.y - rotationCenter.y)) +
                    rotationCenter.y;
            return {x: x, y: y};
        },
        inRectangle: function (rectangle, clientX, clientY, angle, rotationCenter) {
            if (!angle)angle = 0;
            if(angle == 0) {
                var point = {x: clientX, y: clientY};
                if(rectangle.x <= point.x && rectangle.x + rectangle.width >= point.x) {
                    if(rectangle.y <= point.y && rectangle.y + rectangle.height >= point.y) {
                        return true;
                    }
                }
                return false;
            } else {
                if (!rotationCenter)rotationCenter = MapEditor.getCenter(rectangle);

                /**/

                //var clickPoint = {x: clientX, y: clientY};
                var P = {x: clientX, y: clientY};
                var A = MapEditor.rotatePoint(rotationCenter, {x: rectangle.x, y: rectangle.y}, angle);
                var B = MapEditor.rotatePoint(rotationCenter, {
                    x: rectangle.x + rectangle.width,
                    y: rectangle.y
                }, angle);
                var C = MapEditor.rotatePoint(rotationCenter, {
                    x: rectangle.x + rectangle.width,
                    y: rectangle.y + rectangle.height
                }, angle);
                var D = MapEditor.rotatePoint(rotationCenter, {
                    x: rectangle.x,
                    y: rectangle.y + rectangle.height
                }, angle);

                function triangle(A, B, C) {
                    return Math.abs(A.y * (B.x - C.x) + B.y * (C.x - A.x) + C.y * (A.x - B.x)) / 2
                }

                var triangle1 = triangle(A, B, P);
                var triangle2 = triangle(C, B, P);
                var triangle3 = triangle(C, D, P);
                var triangle4 = triangle(D, A, P);

                var sum = (triangle1 + triangle2 + triangle3 + triangle4);
                var square = rectangle.width * rectangle.height;
                var diff = Math.abs(sum - square);
                return diff/square < 0.01
                
            }
        },
        doMapType: function (gameType, isChecked, teamRespawns) {
            var id = "gameType_" + gameType;
            var input = Dom.el('input', {name: 'gameType', type: 'radio', value: gameType, id: id});
            input.onclick = function () {
                for (var i = MapEditor.mountedObjects.length - 1; i >= 0; i--) {
                    var obj = MapEditor.mountedObjects[i];
                    if ((teamRespawns && obj.type == 'respawn') || (!teamRespawns && (obj.type == 'respawn_blue' || obj.type == 'respawn_red' || obj.type == 'flag_red' || obj.type == 'flag_blue'))) {
                        MapEditor.mountedObjects.splice(i, 1);
                    }
                }
                MapEditor.gameType = gameType;
                MapEditor.redrawZoneButtons();
                MapEditor.render();
            };
            if (isChecked) {
                input.checked = true;
            }
            return Dom.el('label', {'for': id}, [input, gameType]);
        },
        checkMapName: function (name, mapNameEror) {
            MapEditor.mapName = name;
            if (!name) {
                mapNameEror.innerHTML = "Please write map name."
            } else {
                Rest.doPost('map/name-empty', name).then(function (response) {
                    if (response !== true) {
                        mapNameEror.innerHTML = "Map with this name already exist";
                    } else {
                        mapNameEror.innerHTML = '';
                    }
                })
            }
        },
        beforeOpen: function () {
            MapEditor.changeMapSize();
            var loadMap = function () {
                var hash = document.location.hash;
                if (hash) hash = hash.replace('#', '').trim();
                if (hash) {
                    try {
                        Rest.doGet('map/load-map-by-hash?hash=' + hash).then(function (r) {
                            MapEditor.x = r.x;
                            MapEditor.y = r.y;
                            MapEditor.gameType = r.gameType;
                            MapEditor.mapName = r.name;
                            MapEditor.mountedObjects = [];
                            if (r.zones) {
                                for (var i = 0; i < r.zones.length; i++) {
                                    var zone = r.zones[i];

                                    if (zone.type === 'tiled') {
                                        zone.stepX = zone.shiftX / zone.width;
                                        zone.stepY = zone.shiftY / zone.height;
                                        zone.tileId = zone.tileId + "_" + (zone.shiftX) + "x" + (zone.shiftY);
                                    }
                                    var mounting = {
                                        type: zone.type,
                                        pointA: {x: zone.x, y: zone.y},
                                        pointB: {x: zone.x + zone.width, y: zone.y + zone.height},
                                        highlight: false,
                                        angle: zone.angle || 0,
                                        customSprite: zone.customSprite,
                                        tileId: zone.tileId,
                                        tileset: zone.tileset,
                                        stepX: zone.stepX,
                                        stepY: zone.stepY
                                    };

                                    MapEditor.doMount(mounting);
                                }
                            }
                            MapEditor.render();
                            MapEditor.changeMapSize()
                        })
                    } catch (e) {
                    }
                }
            };
            if (!MapEditor.objectsLoaded) {
                MapEditor.objectsLoaded = true;
                MapEditor.loadObjects().then(function () {
                    loadMap();
                });
            } else {
                loadMap();
            }

        },
        onSubmit: function (e) {
            e.preventDefault();
            var zones = [];
            for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
                var zone = MapEditor.mountedObjects[i];
                var rect = MapEditor.doRectangle(zone);
                rect.type = zone.type;
                
                if (zone.type === 'tiled') {
                    if (zone.tileset) {
                        var data = zone.tileId.split('_');
                        rect.tile = data[0];
                        var cord = data[1].split('x');
                        rect.shiftX = cord[0];
                        rect.shiftY = cord[1];
                    } else {
                        rect.tile = zone.tileId;
                    }
                }
                zones.push(rect);
            }
            var map = {
                name: MapEditor.mapName,
                x: MapEditor.x,
                y: MapEditor.y,
                gameType: MapEditor.gameType,
                zonesDto: zones
            };
            if (document.location.hash) {
                map.mapHash = document.location.hash.replace("#", '').trim();
            }
            Rest.doPost('map/save', map, 'text').then(function (response) {
                if (response != -1) {
                    alert('Map was saved. Map hash for edit: ' + response);
                    document.location.hash = response;
                } else {
                    alert("Can't save map due unknown reasons. May be name is not unique, or there is no respawn points.")
                }
            })
        },
        normalizePoints: function (mounting) {
            var rect = MapEditor.doRectangle(mounting);
            mounting.pointA = {x: rect.x, y: rect.y};
            mounting.pointB = {x: rect.x + rect.width, y: rect.y + rect.height};
        },
        doMount: function (mounting) {
            MapEditor.normalizePoints(mounting);

            MapEditor.mountedObjects.push(mounting);
            MapEditor.appendControlButton(mounting);
            MapEditor.mounting = {
                type: null,
                pointA: null,
                pointB: null,
                highlight: false,
                angle: 0,
                customSprite: null,
                tileId: 0
            };
            MapEditor.render();
            MapEditor.write("Object " + mounting.type + " was mounted.");
        },
        onClick: function (e) {
            var type = MapEditor.mounting.type;
            if (type) {
                var point = {x: e.offsetX, y: e.offsetY};
                if (MapEditor.gridSize > 1) {
                    if (!MapEditor.mounting.pointA) {
                        point.x = Math.floor(point.x / MapEditor.gridSize) * MapEditor.gridSize;
                        point.y = Math.floor(point.y / MapEditor.gridSize) * MapEditor.gridSize;
                    } else {
                        point.x = Math.ceil(point.x / MapEditor.gridSize) * MapEditor.gridSize;
                        point.y = Math.ceil(point.y / MapEditor.gridSize) * MapEditor.gridSize;
                    }
                }
                var zone = MapEditor.findZone(type);
                if (!MapEditor.mounting.pointA) {
                    if (zone.type === 'tiled' && zone.tileset) {
                        MapEditor.mounting.stepX = zone.stepX;
                        MapEditor.mounting.stepY = zone.stepY;
                        MapEditor.mounting.tileset = true;
                    }
                    if (zone.staticSize) {
                        if (MapEditor.gridSize <= 1) {
                            point.x = point.x - zone.width / 2;
                            point.y = point.y - zone.height / 2;
                        }
                        MapEditor.mounting.pointA = point;
                        MapEditor.mounting.pointB = {x: point.x + zone.width, y: point.y + zone.height};
                        MapEditor.doMount(MapEditor.mounting);
                    } else {
                        MapEditor.mounting.pointA = point;
                        MapEditor.write("Set right-bottom corner of " + type);
                    }
                } else {
                    MapEditor.mounting.pointB = point;
                    MapEditor.doMount(MapEditor.mounting);
                }
            } else {
                if(MapEditor.stopClick ) {
                    MapEditor.stopClick = false;
                    return;
                }
                var clientX = e.clientX;
                var clientY = e.clientY;
                for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
                    var obj = MapEditor.mountedObjects[i];
                    var rect = MapEditor.doRectangle(obj);
                    if (MapEditor.inRectangle(rect, clientX, clientY, obj.angle, MapEditor.getCenter(obj))) {
                        for (var j = 0; j < MapEditor.mountedObjects.length; j++) {
                            var prevObject = MapEditor.mountedObjects[j];
                            if (prevObject.highlight && prevObject != obj) {
                                prevObject.highlight = false;
                                prevObject.component.update();
                            }
                        }
                         
                        obj.highlight = !obj.highlight;
                        obj.component.update();
                        MapEditor.render();
                        if (obj.highlight) {
                            MapEditor.mountedObjects.splice(i, 1);
                            MapEditor.mountedObjects.push(obj);
                            MapEditor.updateMountedObjects();
                        }
                        break;
                    }
                }
            }
        },
        findZone: function (type) {
            if (type === 'tiled') {
                return MapEditor.zones[MapEditor.mounting.tileId]
            } else {
                return MapEditor.zones[type]
            }
        },
        render: function () {
            if (MapEditor.x != MapEditor.inputX.value) {
                MapEditor.inputX.value = MapEditor.x;
            }
            if (MapEditor.y != MapEditor.inputY.value) {
                MapEditor.inputY.value = MapEditor.y;
            }
            if (MapEditor.mapName != MapEditor.inputName.value) {
                MapEditor.inputName.value = MapEditor.mapName;
            }

            var context = MapEditor.context;
            context.clearRect(0, 0, MapEditor.x, MapEditor.y);
            var clickedZone = null;
            for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
                var zone = MapEditor.mountedObjects[i];
                if (zone.highlight) {
                    clickedZone = zone;
                } else {
                    MapEditor.drawZone(zone)
                }
            }
            if (clickedZone != null) {
                MapEditor.drawZone(clickedZone);
            }
            context.beginPath();
            context.strokeStyle = "#60BB60";
            if (MapEditor.gridSize && MapEditor.gridSize > 1) {
                context.beginPath();
                for (var x = 0; x < MapEditor.x; x += MapEditor.gridSize) {
                    context.moveTo(x, 0);
                    context.lineTo(x, MapEditor.y);
                }
                for (var y = 0; y < MapEditor.y; y += MapEditor.gridSize) {
                    context.moveTo(0, y);
                    context.lineTo(MapEditor.x, y);
                }
                context.stroke();
            }
        },
        getCenter: function (zone) {
            if (zone.pointA && zone.pointB) {
                return {
                    x: zone.pointA.x + ((zone.pointB.x - zone.pointA.x) / 2),
                    y: zone.pointA.y + ((zone.pointB.y - zone.pointA.y) / 2)
                }
            } else {
                return {
                    x: zone.x + (zone.width / 2),
                    y: zone.y + (zone.height / 2)
                }
            }
        },
        drawZone: function (zone) {
            var context = MapEditor.context;
            context.save();
            var rect = MapEditor.doRectangle(zone);
            if (zone.highlight) {
                context.strokeStyle = "#EA0013";
                context.fillStyle = '#EA0013';
            } else {
                context.strokeStyle = "#5E354F";
                context.fillStyle = '#5E354F';
            }
            var center = MapEditor.getCenter(zone);
            context.translate(center.x, center.y);
            context.rotate(zone.angle);
            rect = {
                x: rect.width / -2,
                y: rect.height / -2,
                width: rect.width,
                height: rect.height
            };
            if (zone.type != 'wall') {
                context.beginPath();
                context.strokeText(zone.type, rect.x + 3, rect.y + 20, rect.width - 6);
                context.rect(rect.x, rect.y, rect.width, rect.height);
                if (zone.type === 'tiled') {
                    (function (zone, rect) {
                        var image = new Image();
                        image.src = MapEditor.playGround.uploadPath + zone.customSprite;
                        image.onload = function () {
                            if (zone.tileset) {
                                context.drawImage(image, zone.stepX * rect.width, zone.stepY * rect.height, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height);
                            } else {
                                context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
                            }
                        }
                    })(zone, rect);
                }
            } else {
                context.fillRect(rect.x, rect.y, rect.width, rect.height)
            }
            context.stroke();

            if (zone.highlight) {
                context.fillStyle = '#EA0013';
                context.fillRect(rect.x, rect.y, rect.width, rect.height);

                context.fillStyle = "green";
                context.strokeStyle = "black";
                var controls = MapEditor.getControlRectangles(rect, zone);
                var control;
                var radius, centerX, centerY;
                for (var c = 0; c < controls.resize.length; c++) {
                    context.beginPath();
                    control = controls.resize[c];
                    radius = control.width / 2;
                    centerX = control.x + radius;
                    centerY = control.y + radius;
                    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                    context.fill();
                    context.stroke();
                }
                context.beginPath();
                context.fillStyle = "yellow";
                control = controls.turn;
                radius = control.width / 2;
                centerX = control.x + radius;
                centerY = control.y + radius;
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();
            }
            context.restore();
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
            out.angle = zone.angle
            return out;
        },
        getControlRectangles: function (rect, obj) {
            if (obj === undefined) {
                throw "Mounted object must be defined";
            }
            var controlMargin = 10;
            var conrtolSize = 10;

            var zone = MapEditor.zones[obj.type];
            var resize;
            if (zone.staticSize) {
                resize = [];
            } else {
                resize = [
                    {
                        x: rect.x + rect.width / 2 - conrtolSize / 2,
                        y: rect.y - controlMargin - conrtolSize,
                        width: conrtolSize,
                        height: conrtolSize
                    },
                    {
                        x: rect.x + rect.width + controlMargin,
                        y: rect.y + rect.height / 2 - conrtolSize / 2,
                        width: conrtolSize,
                        height: conrtolSize
                    },
                    {
                        x: rect.x + (rect.width) / 2 - conrtolSize / 2,
                        y: rect.y + rect.height + controlMargin,
                        width: conrtolSize,
                        height: conrtolSize
                    },
                    {
                        x: rect.x - controlMargin - conrtolSize,
                        y: rect.y + rect.height / 2 - conrtolSize / 2,
                        width: conrtolSize,
                        height: conrtolSize
                    }
                ]
            }

            return {
                resize: resize,
                turn: {
                    x: rect.x + rect.width + controlMargin,
                    y: rect.y + rect.height + controlMargin,
                    width: conrtolSize,
                    height: conrtolSize
                }
            };
        },
        redrawZoneButtons: function () {
            var doInput = function (zone, key) {
                var name = zone.type !== 'tiled' ? zone.type : zone.tileName;
                var input = Dom.el('input', {
                    type: 'button',
                    'class': 'item item-' + zone.type,
                    value: name
                });
                input.onclick = function () {
                    MapEditor.mount(zone)
                };
                if (zone.type == 'tiled') {
                    input.style.background = "url(" + MapEditor.playGround.uploadPath + zone.customSprite + ") no-repeat";
                    if (zone.tileset) {
                        input.style.height = zone.height + 'px';
                        input.style.width = zone.width + 'px';
                        input.style.backgroundPosition = (-zone.width * zone.stepX) + 'px ' + (-zone.height * zone.stepY) + "px ";
                    } else {
                        input.style.height = '64px';
                        input.style.width = '64px';
                        input.style.backgroundSize = "100% 100%";
                    }
                }
                MapEditor.zones[key] = zone;
                return input;
            };
            var doTileset = function (zone) {
                var image = new Image();
                var header = Dom.el('div');
                var container = Dom.el('div');
                var out = new Dom.el('div', 'tileset', [header, container]);
                image.onload = function () {
                    var width = this.width;
                    var height = this.height;
                    var zWidth = parseInt(zone.width);
                    var zHeight = parseInt(zone.height);
                    header.innerText = zone.tileName + ' ' + zWidth + "x" + zHeight;
                    if (zWidth < 1 || zHeight < 1) {
                        return;
                    }
                    var stepY = 0;
                    while (stepY * zHeight <= height) {
                        var stepX = 0;
                        var row = Dom.el('div');
                        while (stepX * zWidth <= width) {
                            var tileId = zone.tileId + "_" + (stepX * zWidth) + "x" + (stepY * zHeight);
                            row.appendChild(doInput({
                                id: zone.id,
                                tileId: tileId,
                                tileName: '',
                                x: zone.x,
                                y: zone.y,
                                width: zWidth,
                                height: zHeight,
                                type: 'tiled',
                                passable: zone.passable,
                                shootable: zone.shootable,
                                staticSize: zone.staticSize,
                                tileset: true,
                                stepX: stepX,
                                stepY: stepY,
                                customSprite: zone.customSprite
                            }, tileId));
                            stepX++;
                        }
                        container.appendChild(row);
                        stepY++;
                    }
                };
                image.src = MapEditor.playGround.uploadPath + "/" + zone.customSprite;
                return out;
            };
            MapEditor.zonesButtons.innerHTML = '';
            var ctfZones = [
                'respawn_red', 'respawn_blue', 'flag_red', 'flag_blue'
            ];
            var nonCtfZones = [
                'respawn'
            ];
            for (var i = 0; i < MapEditor.zonesButtonsData.length; i++) {
                var zone = MapEditor.zonesButtonsData[i];
                var type = zone.type;
                if (nonCtfZones.indexOf(type) > -1 && MapEditor.gameType === 'ctf')continue;
                if (ctfZones.indexOf(type) > -1 && MapEditor.gameType !== 'ctf')continue;

                if (zone.tileset) {
                    MapEditor.zonesButtons.appendChild(doTileset(zone));
                } else {
                    var key = zone.type == 'tiled' ? zone.tileId : zone.type;
                    MapEditor.zonesButtons.appendChild(doInput(zone, key));
                }
            }
            MapEditor.zones.tiled = {staticSize: true}
        },
        loadObjects: function () {
            MapEditor.zones = {};
            MapEditor.zonesButtons.innerHTML = '';
            MapEditor.zonesButtonsData = [];

            return Rest.doGet('zones/list').then(function (zones) {
                MapEditor.zonesButtonsData = zones;
                MapEditor.redrawZoneButtons();
            });
        },
        changeMapSize: function () {
            var element = MapEditor.getMap();
            Dom.update(element, {width: MapEditor.x, height: MapEditor.y});
            MapEditor.render()
        }
        ,
        updateGridSize: function (input) {
            var newValue = input.value;
            var newNumberValue = !newValue ? 0 : parseInt(newValue);
            if (newValue == newNumberValue || !newValue) {
                MapEditor.gridSize = newNumberValue;
                MapEditor.write("Grid size was changed. Now all static-sized objects will be placed" +
                    (newNumberValue > 1 ?
                        ' based on <span style="color:red">left-top corner</span>. ' :
                        ' based on <span style="color:red">it center</span>.') + ' Also you can change positions after placement manually.')
            } else {
                input.value = MapEditor.gridSize;
            }
        },
        updateDimension: function (input, isX) {
            var newValue = input.value;
            var newNumberValue = !newValue ? 0 : parseInt(newValue);
            if (!newValue || newValue == newNumberValue) {
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
        mount: function (zone) {
            MapEditor.mounting.type = zone.type;
            MapEditor.mounting.tileId = zone.tileId;
            MapEditor.mounting.pointA = null;
            MapEditor.mounting.pointB = null;
            MapEditor.mounting.customSprite = zone.customSprite;

            MapEditor.write("Select left - top corner for " + zone.type);
        },
        write: function (text) {
            MapEditor.getConsole().innerHTML = text + "<br>" + MapEditor.getConsole().innerHTML;
        },
        getConsole: function () {
            return MapEditor.console;
        },
        appendControlButton: function (obj) {
            var ts = new Date().getTime();
            var type = obj.type;
            var key = type == 'tiled' ? obj.tileId : type;
            var zone = MapEditor.zones[key];
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
            highlight.onchange = function () {
                obj.highlight = this.checked;
                if (obj.highlight) {
                    for (var i = 0; i < MapEditor.mountedObjects.length; i++) {
                        var otherObj = MapEditor.mountedObjects[i];
                        if (otherObj.highlight && otherObj != obj) {
                            otherObj.highlight = false;
                            otherObj.component.update()
                        }
                    }
                }
                MapEditor.render();
            };
            var highLightLabel = Dom.el('label', {'for': 'h_' + ts}, [highlight, 'highlight']);
            var label = Dom.el('p', null, [type, delButton, highLightLabel]);
            Dom.append(out, [label, input1, input2]);
            obj.component = {
                dom: out,
                update: function () {
                    input1.querySelector('#x_' + ts).value = obj.pointA.x;
                    input1.querySelector('#y_' + ts).value = obj.pointA.y;
                    if (input2 != null) {
                        input2.querySelector('#x_' + ts).value = obj.pointB.x;
                        input2.querySelector('#y_' + ts).value = obj.pointB.y;
                    }
                    highlight.checked = obj.highlight;
                }
            };
            MapEditor.updateMountedObjects();
        },
        updateMountedObjects: function () {
            var length = MapEditor.mountedObjects.length;
            MapEditor.zoneTypeHolder.innerHTML = '';
            while (length--) {
                var obj = MapEditor.mountedObjects[length];
                if (!MapEditor.filterValue || obj.type.indexOf(MapEditor.filterValue) == 0) {
                    MapEditor.zoneTypeHolder.appendChild(obj.component.dom);
                }
            }
        }
    };
    return MapEditor;
})());