Engine.define('MapEditor', ['MapObject', 'MainMenu', 'Dom', 'Text', 'CustomTiles', 'DomComponents', 'Rest', 'ControlButton', 'Weapons', 'Config'],
    (function () {

        var MainMenu = Engine.require('MainMenu');
        var MapObject = Engine.require('MapObject');
        var Dom = Engine.require('Dom');
        var Text = Engine.require('Text');
        var CustomTiles = Engine.require('CustomTiles');
        var DomComponents = Engine.require('DomComponents');
        var Rest = Engine.require('Rest');
        var ControlButton = Engine.require('ControlButton');
        var Weapons = Engine.require('Weapons');
        var Config = Engine.require('Config');
        
        
        function MapEditor(context) {
            var placeApplication = function(url, directives){
                context.dispatcher.placeApplication(url, directives);
            };
            this.TITLE = 'Map Editor';
            this.URL = 'map-editor';
            
            this.container = null;
            this.placeApplication = placeApplication;
            this.gridSize = 1;
            this.inputX = null;
            this.inputY = null;
            this.inputName = null;
            this.filterValue = '';
            this.customTiles = null;
            this.x = 640;
            this.y = 480;
            this.gameType = 'dm';
            this.map = null;
            this.mapName = '';
            this.console = Dom.el('p', {id: 'editor_console'});
            this.objectsLoaded = false;
            this.mounting = new MapObject();
            this.context = null;
            this.mounted = null;
            this.mountedObjects = [];
            this.zonesButtons = Dom.el('div', {'class': 'zones my-panel'});
            this.zonesButtonsData = null;
            this.objectOnResize = null;
            this.objectOnDrag = null;
            this.objectOnTurn = null;
            this.weapons = Weapons.getInstance();
            var me = this;
            this.customTiles = new CustomTiles(function () {
                me.loadObjects();
            });
            var mainMenu = new MainMenu(context, placeApplication); 
            DomComponents.doModal(this.zonesButtons);
            this.zoneTypeHolder = Dom.el('div', {'class': 'mounted'});
            var filter = Dom.el('input', {type: 'text', placeholder: 'Filter by zone name'});
            filter.onkeyup = function () {
                me.filterValue = filter.value.toLowerCase();
                me.updateMountedObjects();
            };
            var zoneTypeWrapper = Dom.el('div', 'mounted-wrapper my-panel', [filter, this.zoneTypeHolder]);
            DomComponents.doModal(zoneTypeWrapper);
            this.map = Dom.el('canvas', {width: this.x, height: this.y});
            this.container = Dom.el('div', {'class': 'editor'}, [
                mainMenu.container,
                this.customTiles.container,
                this.doMapControl(), 
                this.zonesButtons,
                zoneTypeWrapper,
                Dom.el('div', 'map-editor-wrapper', this.map)
            ]);
            this.map.onclick = function (e) {
                me.onClick(e)
            };
            this.map.onmousedown = function (e) {
                me.onMouseDown(e)
            };
            this.map.onmouseup = function (e) {
                me.onMouseUp(e);
            };
            this.map.onmousemove = function (e) {
                me.onMouseMove(e);
            };
            this.context = this.map.getContext('2d');
        }

        MapEditor.prototype.doMapControl = function () {
            var labelX = Dom.el('label', {'for': 'x'}, 'Map X');
            var inputX = Dom.el('input', {type: 'text', name: 'x', value: this.x});
            var me = this;
            inputX.onkeyup = function () {
                me.updateDimension(this, true);
                me.changeMapSize();
            };
            me.inputX = inputX;
            var labelY = Dom.el('label', {'for': 'y'}, 'Map Y');
            var inputY = Dom.el('input', {type: 'text', name: 'y', value: me.y});
            inputY.onkeyup = function () {
                me.updateDimension(this, false);
                me.changeMapSize()
            };
            me.inputY = inputY;
            var labelGridSize = Dom.el('label', {'for': 'grid_size'}, 'Grid cell size');
            var inputGridSize = Dom.el('input', {type: 'grid_size', name: 'grid_size', value: me.gridSize});
            inputGridSize.onkeyup = function () {
                me.updateGridSize(this, false);
                me.render()
            };
            var mapName = Dom.el('input', {name: 'map_name', placeholder: 'Map name'});
            var mapNameEror = Dom.el('span', {'style': 'color: red'});
            mapName.onkeyup = function () {
                me.checkMapName(this.value, mapNameEror);
            };
            me.inputName = mapName;
            var goBack = Dom.el('input', {type: 'button', value: 'Create Game'});
            goBack.onclick = function () {
                var c = confirm("Are you sure to leave this page?");
                if (c) {
                    me.placeApplication('map-list');
                }
            };
            var createTile = Dom.el('input', {type: 'button', value: 'Create Tile'});
            createTile.onclick = function () {
                me.customTiles.show();
            };
            var mapControl = Dom.el('form', {'class': 'my-panel main-control'}, [
                labelX, inputX, mapName, mapNameEror, labelGridSize, inputGridSize,
                Dom.el('br'),
                labelY, inputY,
                me.doMapType('dm', true, false), me.doMapType('tdm', false, false), me.doMapType('ctf', false, true),
                Dom.el('input', {type: 'submit', value: 'Save map'}), createTile, goBack,

                me.console
            ]);
            mapControl.onsubmit = function (e) {
                me.onSubmit(e);
            };
            DomComponents.doModal(mapControl);
            return mapControl;
        };
        MapEditor.prototype.onMouseDown = function (e) {
            var me = this;
            for (var i = 0; i < me.mountedObjects.length; i++) {
                var obj = me.mountedObjects[i];
                if (obj.highlight) {
                    var center = me.getCenter(obj);
                    var rect = me.doRectangle(obj);
                    var angle = obj.angle;
                    var clientX = e.clientX;
                    var clientY = e.clientY;
                    var controls = me.getControlRectangles(rect, obj);
                    for (var c = 0; c < controls.resize.length; c++) {
                        var control = controls.resize[c];
                        if (me.inRectangle(control, clientX, clientY, angle, center)) {
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
                            me.objectOnResize = {
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
                    if (me.inRectangle(controls.turn, clientX, clientY, angle, center)) {
                        me.objectOnTurn = {
                            object: obj,
                            center: center,
                            angle: me.getAngle(center.x, center.y, clientX, clientY) - obj.angle
                        };
                        return;
                    }
                    if (me.inRectangle(rect, clientX, clientY, angle, center)) {
                        me.objectOnDrag = {
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
        };
        MapEditor.prototype.getAngle = function (x, y, clientX, clientY) {
            var offset = Dom.calculateOffset(this.map);
            var dy = (clientY + window.scrollY - offset.top) - y;
            var dx = (clientX + window.scrollX - offset.left) - x;
            return Math.atan2(dy, dx);
        };
        MapEditor.prototype.onMouseUp = function (e) {
            var stop = false;
            var me = this;
            if (me.objectOnResize != null) {
                me.normalizePoints(me.objectOnResize.object);
                me.objectOnResize = null;
                stop = true;
            }
            if (me.objectOnDrag != null) {
                me.objectOnDrag = null;
                stop = false;//it ok
            }
            if (me.objectOnTurn != null) {
                me.objectOnTurn = null;
                stop = true;
            }

            if (stop) {
                me.stopClick = true;
                e.preventDefault();
                e.stopPropagation();
                e.preventBubble = true;
            }
        };
        MapEditor.prototype.onMouseMove = function (e) {
            var me = this;
            var resize = me.objectOnResize;
            if (resize != null) {
                var eventValue = e[resize.eventKey];
                resize.object[resize.point][resize.direction] = resize[resize.direction] + resize.shift + (eventValue - resize[resize.eventKey]);
                resize.object.component.update();
                me.render();
            } else if (me.objectOnDrag != null) {
                var clientX = e.clientX;
                var clientY = e.clientY;
                var drag = me.objectOnDrag;
                drag.object.pointA.x = drag.pointA.x + (clientX - drag.clientX);
                drag.object.pointA.y = drag.pointA.y + (clientY - drag.clientY);
                drag.object.pointB.x = drag.pointB.x + (clientX - drag.clientX);
                drag.object.pointB.y = drag.pointB.y + (clientY - drag.clientY);
                drag.object.component.update();
                me.render();
            } else if (me.objectOnTurn != null) {
                var turn = me.objectOnTurn;
                var angle = me.getAngle(turn.center.x, turn.center.y, e.clientX, e.clientY);
                turn.object.angle = angle - turn.angle;
                turn.object.component.update();
                me.render();
            }
        };
        MapEditor.prototype.rotatePoint = function (rotationCenter, point, angle) {
            var x = (Math.cos(angle) * (point.x - rotationCenter.x)) -
                    (Math.sin(angle) * (point.y - rotationCenter.y)) +
                    rotationCenter.x,
                y = (Math.sin(angle) * (point.x - rotationCenter.x)) +
                    (Math.cos(angle) * (point.y - rotationCenter.y)) +
                    rotationCenter.y;
            return {x: x, y: y};
        };
        MapEditor.prototype.inRectangle = function (rectangle, clientX, clientY, angle, rotationCenter) {
            if (!angle)angle = 0;
            var offset = Dom.calculateOffset(this.map);
            var P = {x: clientX + window.scrollX - offset.left, y: clientY + window.scrollY - offset.top };
            if (angle == 0) {
                if (rectangle.x <= P.x && rectangle.x + rectangle.width >= P.x) {
                    if (rectangle.y <= P.y && rectangle.y + rectangle.height >= P.y) {
                        return true;
                    }
                }
                return false;
            } else {
                var me = this;
                if (!rotationCenter)rotationCenter = me.getCenter(rectangle);
                var A = me.rotatePoint(rotationCenter, {x: rectangle.x, y: rectangle.y}, angle);
                var B = me.rotatePoint(rotationCenter, {
                    x: rectangle.x + rectangle.width,
                    y: rectangle.y
                }, angle);
                var C = me.rotatePoint(rotationCenter, {
                    x: rectangle.x + rectangle.width,
                    y: rectangle.y + rectangle.height
                }, angle);
                var D = me.rotatePoint(rotationCenter, {
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
                return diff / square < 0.01

            }
        };
        MapEditor.prototype.doMapType = function (gameType, isChecked, teamRespawns) {
            var id = "gameType_" + gameType;
            var me = this;
            var input = Dom.el('input', {name: 'gameType', type: 'radio', value: gameType, id: id});
            input.onclick = function () {
                for (var i = me.mountedObjects.length - 1; i >= 0; i--) {
                    var obj = me.mountedObjects[i];
                    if ((teamRespawns && obj.type == 'respawn') || (!teamRespawns && (obj.type == 'respawn_blue' || obj.type == 'respawn_red' || obj.type == 'flag_red' || obj.type == 'flag_blue'))) {
                        me.mountedObjects.splice(i, 1);
                    }
                }
                me.gameType = gameType;
                me.redrawZoneButtons();
                me.render();
            };
            if (isChecked) {
                input.checked = true;
            }
            return Dom.el('label', {'for': id}, [input, gameType]);
        };
        MapEditor.prototype.checkMapName = function (name, mapNameEror) {
            this.mapName = name;
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
        };
        MapEditor.prototype.beforeOpen = function () {
            var me = this;
            me.changeMapSize();
            var loadMap = function () {
                var hash = document.location.hash;
                if (hash) hash = hash.replace('#', '').trim();
                if (hash) {
                    try {
                        Rest.doGet('map/load-map-by-hash?hash=' + hash).then(function (r) {
                            me.x = r.x;
                            me.y = r.y;
                            me.gameType = r.gameType;
                            me.mapName = r.name;
                            me.mountedObjects = [];
                            if (r.zones) {
                                for (var i = 0; i < r.zones.length; i++) {
                                    var zone = r.zones[i];

                                    if (zone.type === 'tiled') {
                                        zone.stepX = zone.shiftX / zone.width;
                                        zone.stepY = zone.shiftY / zone.height;
                                        if(zone.tileset) {
                                            zone.tileId = zone.tileId + "_" + (zone.shiftX) + "x" + (zone.shiftY);
                                        }
                                    }
                                    var mounting = new MapObject(zone.type);
                                    mounting.pointA = {x: zone.x, y: zone.y}; 
                                    mounting.pointB = {x: zone.x + zone.width, y: zone.y + zone.height}; 
                                    mounting.angle = zone.angle || 0;
                                    mounting.customSprite = zone.customSprite;
                                    mounting.tileId = zone.tileId;
                                    mounting.tileset = zone.tileset;
                                    mounting.stepX = zone.stepX;
                                    mounting.stepY = zone.stepY;
                                    mounting.passable = zone.passable || false;
                                    mounting.shootable = zone.shootable || false;
                                    me.doMount(mounting);
                                }
                            }
                            me.render();
                            me.changeMapSize()
                        })
                    } catch (e) {
                    }
                }
            };
            if (!me.objectsLoaded) {
                me.objectsLoaded = true;
                me.loadObjects().then(function () {
                    loadMap();
                });
            } else {
                loadMap();
            }

        };
        MapEditor.prototype.onSubmit = function (e) {
            e.preventDefault();
            var me = this;
            var zones = [];
            for (var i = 0; i < me.mountedObjects.length; i++) {
                var zone = me.mountedObjects[i];
                var rect = me.doRectangle(zone);
                rect.type = zone.type;
                if(zone.type === 'tiled' || zone.type === 'wall') {
                    rect.passable = zone.passable;
                    rect.shootable = zone.shootable;
                }
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
                name: me.mapName,
                x: me.x,
                y: me.y,
                gameType: me.gameType,
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
        };
        MapEditor.prototype.normalizePoints = function (mounting) {
            var rect = this.doRectangle(mounting);
            mounting.pointA = {x: rect.x, y: rect.y};
            mounting.pointB = {x: rect.x + rect.width, y: rect.y + rect.height};
        };
        MapEditor.prototype.doMount = function (mounting) {
            this.normalizePoints(mounting);

            this.mountedObjects.push(mounting);
            this.appendControlButton(mounting);
            this.mounting = new MapObject();
            this.render();
            this.write("Object " + mounting.type + " was mounted.");
        };
        MapEditor.prototype.onClick = function (e) {
            var type = this.mounting.type;
            var me = this;
            if (type) {
                var point = {x: e.offsetX, y: e.offsetY};
                if (this.gridSize > 1) {
                    if (!this.mounting.pointA) {
                        point.x = Math.floor(point.x / this.gridSize) * this.gridSize;
                        point.y = Math.floor(point.y / this.gridSize) * this.gridSize;
                    } else {
                        point.x = Math.ceil(point.x / this.gridSize) * this.gridSize;
                        point.y = Math.ceil(point.y / this.gridSize) * this.gridSize;
                    }
                }
                var zone = me.findZone(type);
                if (!me.mounting.pointA) {
                    if (zone.type === 'tiled' && zone.tileset) {
                        me.mounting.stepX = zone.stepX;
                        me.mounting.stepY = zone.stepY;
                        me.mounting.tileset = true;
                    }
                    if (zone.staticSize) {
                        if (me.gridSize <= 1) {
                            point.x = point.x - zone.width / 2;
                            point.y = point.y - zone.height / 2;
                        }
                        me.mounting.pointA = point;
                        me.mounting.pointB = {x: point.x + zone.width, y: point.y + zone.height};
                        me.doMount(me.mounting);
                    } else {
                        me.mounting.pointA = point;
                        me.write("Set right-bottom corner of " + type);
                    }
                } else {
                    me.mounting.pointB = point;
                    me.doMount(me.mounting);
                }
            } else {
                if (me.stopClick) {
                    me.stopClick = false;
                    return;
                }
                var clientX = e.clientX;
                var clientY = e.clientY;
                for (var i = 0; i < me.mountedObjects.length; i++) {
                    var obj = me.mountedObjects[i];
                    var rect = me.doRectangle(obj);
                    if (me.inRectangle(rect, clientX, clientY, obj.angle, me.getCenter(obj))) {
                        for (var j = 0; j < me.mountedObjects.length; j++) {
                            var prevObject = me.mountedObjects[j];
                            if (prevObject.highlight && prevObject != obj) {
                                prevObject.highlight = false;
                                prevObject.component.update();
                            }
                        }

                        obj.highlight = !obj.highlight;
                        obj.component.update();
                        me.render();
                        if (obj.highlight) {
                            me.mountedObjects.splice(i, 1);
                            me.mountedObjects.push(obj);
                            me.updateMountedObjects();
                        }
                        break;
                    }
                }
            }
        };
        MapEditor.prototype.findZone = function (type) {
            if (type === 'tiled') {
                return this.zones[this.mounting.tileId]
            } else {
                return this.zones[type]
            }
        };
        MapEditor.prototype.render = function () {
            var me = this;
            if (me.x != me.inputX.value) {
                me.inputX.value = me.x;
            }
            if (me.y != me.inputY.value) {
                me.inputY.value = me.y;
            }
            if (me.mapName != me.inputName.value) {
                me.inputName.value = me.mapName;
            }

            var context = me.context;
            context.clearRect(0, 0, me.x, me.y);
            var clickedZone = null;
            for (var i = 0; i < me.mountedObjects.length; i++) {
                var zone = me.mountedObjects[i];
                if (zone.highlight) {
                    clickedZone = zone;
                } else {
                    me.drawZone(zone)
                }
            }
            if (clickedZone != null) {
                me.drawZone(clickedZone);
            }
            context.beginPath();
            context.strokeStyle = "#60BB60";
            if (me.gridSize && me.gridSize > 1) {
                context.beginPath();
                for (var x = 0; x < me.x; x += me.gridSize) {
                    context.moveTo(x, 0);
                    context.lineTo(x, me.y);
                }
                for (var y = 0; y < me.y; y += me.gridSize) {
                    context.moveTo(0, y);
                    context.lineTo(me.x, y);
                }
                context.stroke();
            }
        };
        MapEditor.prototype.getCenter = function (zone) {
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
        };
        MapEditor.prototype.drawZone = function (zone) {
            var context = this.context;
            context.save();
            context.beginPath();
            var rect = this.doRectangle(zone);
            if (zone.highlight) {
                context.strokeStyle = "#EA0013";
                context.fillStyle = '#EA0013';
            }
            var center = this.getCenter(zone);
            context.translate(center.x, center.y);
            context.rotate(zone.angle);
            rect = {
                x: rect.width / -2,
                y: rect.height / -2,
                width: rect.width,
                height: rect.height
            };

            var image = new Image();

            function drawZoneImage(path, fullPath) {
                image.src = fullPath === true ? path : "images/map/" + path;
                context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
                context.rect(rect.x, rect.y, rect.width, rect.height);
                context.stroke();
            }

            switch (zone.type) {
                case 'flag_blue':
                case 'flag_red':
                    drawZoneImage('images/teams/' + zone.type + ".png", true);
                    break;
                case 'respawn_blue':
                    context.fillStyle = 'rgba(54, 159, 236, 0.41)';
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);
                    break;
                case 'respawn_red':
                    context.fillStyle = 'rgba(210, 63, 63, 0.41)';
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);
                    break;
                case 'respawn':
                    context.fillStyle = '#35ff4c';
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);
                    break;
                case 'wall':
                case "pistol":
                case "shotgun":
                case "assault":
                case "sniper":
                case "minigun":
                case "rocket":
                case "medkit":
                case "armor":
                case "helm":
                    drawZoneImage(zone.type + '.png');
                    break;
                case "flamethrower":
                    drawZoneImage('flame.png');
                    break;
                case 'tiled':
                    (function (zone, rect) {
                        var imagePath = Config.uploadPath + zone.customSprite;
                        image.src = imagePath;
                        if (zone.tileset) {
                            context.drawImage(image, zone.stepX * rect.width, zone.stepY * rect.height, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height);
                        } else {
                            drawZoneImage(imagePath, true);
                        }
                    })(zone, rect);
                    break;
                default:
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);
            }

            if (zone.highlight) {
                context.fillStyle = '#EA0013';
                context.fillRect(rect.x, rect.y, rect.width, rect.height);

                context.fillStyle = "green";
                context.strokeStyle = "black";
                var controls = this.getControlRectangles(rect, zone);
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
        };
        MapEditor.prototype.doRectangle = function (zone) {
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
            out.angle = zone.angle;
            return out;
        };
        MapEditor.prototype.getControlRectangles = function (rect, obj) {
            if (obj === undefined) {
                throw "Mounted object must be defined";
            }
            var controlMargin = 10;
            var conrtolSize = 10;

            var zone = this.zones[obj.type];
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
        };
        MapEditor.prototype.redrawZoneButtons = function () {
            var me = this;
            var doInput = function (zone, key) {
                var name = zone.type !== 'tiled' ? zone.type : zone.tileName;
                var input = Dom.el('input', {
                    type: 'button',
                    'class': 'item item-' + zone.type,
                    value: name.indexOf('respawn') > -1 ? 'respawn' : ' '
                });
                input.onclick = function () {
                    me.mount(zone)
                };
                if (zone.type == 'tiled') {
                    input.style.background = "url(" + Config.uploadPath + zone.customSprite + ") no-repeat";
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
                me.zones[key] = zone;
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
                    container.setAttribute('style', 'width: ' + width + 'px');
                    var zWidth = parseInt(zone.width);
                    var zHeight = parseInt(zone.height);
                    header.innerText = zone.tileName + ' ' + zWidth + "x" + zHeight;
                    if (zWidth < 1 || zHeight < 1) {
                        return;
                    }
                    var maxWidth = -1;
                    var stepY = 0;
                    while (stepY * zHeight <= height) {
                        var stepX = 0;
                        var row = Dom.el('div');
                        while (stepX * zWidth <= width) {
                            var currentWidth = stepX * zWidth;
                            if(currentWidth > maxWidth) {
                                maxWidth = currentWidth;
                            }
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
                    container.style.width = (maxWidth + zWidth) + 'px';
                };
                image.src = Config.uploadPath + "/" + zone.customSprite;
                return out;
            };
            me.zonesButtons.innerHTML = '';
            var ctfZones = [
                'respawn_red', 'respawn_blue', 'flag_red', 'flag_blue'
            ];
            var nonCtfZones = [
                'respawn'
            ];
            for (var i = 0; i < me.zonesButtonsData.length; i++) {
                var zone = me.zonesButtonsData[i];
                var type = zone.type;
                if (nonCtfZones.indexOf(type) > -1 && me.gameType === 'ctf')continue;
                if (ctfZones.indexOf(type) > -1 && me.gameType !== 'ctf')continue;

                if (zone.tileset) {
                    me.zonesButtons.appendChild(doTileset(zone));
                } else {
                    var key = zone.type == 'tiled' ? zone.tileId : zone.type;
                    me.zonesButtons.appendChild(doInput(zone, key));
                }
            }
            me.zones.tiled = {staticSize: true}
        };
        MapEditor.prototype.loadObjects = function () {
            var me = this;
            me.zones = {};
            me.zonesButtons.innerHTML = '';
            me.zonesButtonsData = [];

            return Rest.doGet('zones/list').then(function (zones) {
                me.zonesButtonsData = zones;
                me.redrawZoneButtons();
            });
        };
        MapEditor.prototype.changeMapSize = function () {
            var element = this.getMap();
            Dom.update(element, {width: this.x, height: this.y});
            this.render()
        };
        MapEditor.prototype.updateGridSize = function (input) {
            var newValue = input.value;
            var newNumberValue = !newValue ? 0 : parseInt(newValue);
            if (newValue == newNumberValue || !newValue) {
                this.gridSize = newNumberValue;
                this.write("Grid size was changed. Now all static-sized objects will be placed" +
                    (newNumberValue > 1 ?
                        ' based on <span style="color:red">left-top corner</span>. ' :
                        ' based on <span style="color:red">it center</span>.') + ' Also you can change positions after placement manually.')
            } else {
                input.value = this.gridSize;
            }
        };
        MapEditor.prototype.updateDimension = function (input, isX) {
            var newValue = input.value;
            var newNumberValue = !newValue ? 0 : parseInt(newValue);
            if (!newValue || newValue == newNumberValue) {
                if (isX) {
                    this.x = newNumberValue;
                } else {
                    this.y = newNumberValue;
                }
            } else {
                if (isX) {
                    input.value = this.x;
                } else {
                    input.value = this.y;
                }
            }

        };
        MapEditor.prototype.getMap = function () {
            return this.map;
        };
        MapEditor.prototype.mount = function (zone) {
            this.mounting.type = zone.type;
            this.mounting.tileId = zone.tileId;
            this.mounting.pointA = null;
            this.mounting.pointB = null;
            this.mounting.customSprite = zone.customSprite;

            this.write("Select left - top corner for " + zone.type);
        };
        MapEditor.prototype.write = function (text) {
            this.getConsole().innerHTML = text + "<br>" + this.getConsole().innerHTML;
        };
        MapEditor.prototype.getConsole = function () {
            return this.console;
        };
        MapEditor.prototype.appendControlButton = function (obj) {
            var type = obj.type;
            var key = type == 'tiled' ? obj.tileId : type;
            var zone = this.zones[key];
            var controlButton = new ControlButton(obj, zone, this);
            
            obj.component = {
                dom: controlButton.container,
                update: function () {
                    controlButton.update();
                }
            };
            this.updateMountedObjects();
        };
        MapEditor.prototype.updateMountedObjects = function () {
            var me = this;
            var length = me.mountedObjects.length;
            me.zoneTypeHolder.innerHTML = '';
            while (length--) {
                var obj = me.mountedObjects[length];
                if (!me.filterValue || obj.type.indexOf(me.filterValue) == 0) {
                    me.zoneTypeHolder.appendChild(obj.component.dom);
                }
            }
        };
        return MapEditor;
    }));