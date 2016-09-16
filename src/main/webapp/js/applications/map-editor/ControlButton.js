Engine.define('ControlButton', ['Dom', 'Text', 'Checkbox'], function () {

    var Dom = Engine.require('Dom');
    var Text = Engine.require('Text');
    var Checkbox = Engine.require('Checkbox');

    function ControlButton(obj, zone, mapEditor) {

        var ts = new Date().getTime();
        var type = obj.type;
        this.container = Dom.el('div');
        this.obj = obj;
        this.mapEditor = mapEditor;
        this.zone = zone;

        var me = this;

        this.x = new Text({name: 'x', id: 'x_' + ts, value: obj.pointA.x, onkeyup: function (e) {
            me.inputPositionKeyPress(e);
        }});
        this.y = new Text({name: 'y', id: 'y_' + ts, value: obj.pointA.y, onkeyup: function (e) {
            me.inputPositionKeyPress(e);
        }});
        this.width = null;
        this.height = null;

        var coordinates = Dom.el('div', 'coordinates', [this.x.container, this.y.container]);

        var coordinatesWh = null;
        if (!zone.staticSize) {
            this.width = new Text({name: 'width', id: 'width_' + ts, onkeyup: function (e) {
                me.inputDimensionKeyPress(e);
            }, value: Math.abs(obj.pointB.x - obj.pointA.x)});

            this.height = new Text({name: 'height', id: 'height_' + ts, onkeyup: function (e) {
                me.inputDimensionKeyPress(e);
            }, value: Math.abs(obj.pointB.y - obj.pointA.y)});

            coordinatesWh = Dom.el('div', 'coordinates', [this.width.container, this.height.container]);
        }
        var delButton = Dom.el('button', {type: 'button', class: 'danger right small'}, 'delete');

        delButton.onclick = function () {
            for (var i = 0; i < mapEditor.mountedObjects.length; i++) {
                if (mapEditor.mountedObjects[i] == obj) {
                    mapEditor.mountedObjects.splice(i, 1);
                    me.container.remove();
                    mapEditor.render();
                }
            }
        };
        this.angle = new Text({
            name: 'angle', class: 'angle', id: "angle_" + ts, value: '0', onkeyup: function (e) {
                var onArrows = 0;
                switch (e.keyCode) {
                    case 9:
                        return;
                    case 38:
                    case 39:
                        onArrows = 1;
                        break;
                    case 37:
                    case 40:
                        onArrows = -1;
                        break;
                }
                var value = parseFloat(me.angle.getValue());
                if(isNaN(value)) {
                    value = 0;
                }
                me.angle.setValue(value + onArrows);

                obj.angle = Math.PI * parseInt(me.angle.getValue()) / 180;
                mapEditor.render();
            }
        });
        this.passable = null;
        this.isShootable = null;
        var controlContainer = Dom.el('div', 'pseudo-controls clearfix', this.angle.container);
        if(type === 'tyled' || type === 'wall') {
            this.passable = new Checkbox({name: 'passable', value: obj.passable,class: 'check', onchange: function(){
                obj.passable = me.passable.getValue();
            }});
            this.shootable = new Checkbox({name: 'shootable', value: obj.shootable, class: 'check', onchange: function(){
                obj.shootable = me.shootable.getValue();
            }});
            Dom.append(controlContainer, [this.passable.container, this.shootable.container]);
        }

        this.highlight = new Checkbox({name: 'highlight', class: 'right hl', id: 'h_' + ts, onchange: function () {
            obj.highlight = me.highlight.getValue();
            if (obj.highlight) {
                for (var i = 0; i < mapEditor.mountedObjects.length; i++) {
                    var otherObj = mapEditor.mountedObjects[i];
                    if (otherObj.highlight && otherObj != obj) {
                        otherObj.highlight = false;
                        otherObj.component.update()
                    }
                }
            }
            mapEditor.render();
        }});
        var label = Dom.el('p', "controls", [this.highlight.container, type, delButton, Dom.el('br', 'clear'), controlContainer]);
        Dom.append(this.container, [label, coordinates, coordinatesWh, Dom.el('hr', 'clear')]);
    }

    ControlButton.prototype.inputDimensionKeyPress = function(e) {
        if (e.keyCode == 9)return;
        var onMove = this.onMove(e);
        this.onChangeSpriteDimension(onMove);

        var wValue = parseInt(this.width.getValue());
        if(isNaN(wValue)) {
            wValue = 0;
        }
        var hValue = parseInt(this.height.getValue());
        if(isNaN(hValue)) {
            hValue = 0;
        }
        
        this.obj.pointB.x = wValue + this.obj.pointA.x;
        this.obj.pointB.y = hValue + this.obj.pointA.y;
        this.mapEditor.render();
    };

    ControlButton.prototype.inputPositionKeyPress = function(e) {
        if (e.keyCode == 9)return;
        var onMove = this.onMove(e);
        
        var wValue = parseFloat(this.x.getValue());
        if(isNaN(wValue)) {
            wValue = 0;
        }
        var hValue = parseFloat(this.y.getValue());
        if(isNaN(hValue)) {
            hValue = 0;
        }
        
        var pointA = this.obj.pointA;
        var pointB = this.obj.pointB;

        var oldX = pointA.x;
        var oldY = pointA.y;
        
        this.x.setValue(wValue + onMove.horizontal);
        this.y.setValue(hValue + onMove.vertical);

        pointA.x = parseInt(this.x.getValue());
        pointA.y = parseInt(this.y.getValue());

        if (this.zone.staticSize) {
            pointB.x = pointA.x + this.zone.width;
            pointB.y = pointA.y + this.zone.height
        } else {
            pointB.x = pointB.x + (pointA.x - oldX);
            pointB.y = pointB.y + (pointA.y - oldY);
        }
        this.mapEditor.render();
    };

    ControlButton.prototype.onChangeSpriteDimension = function(onMove) {
        var wValue = parseFloat(this.width.getValue());
        if(isNaN(wValue)) {
            wValue = 0;
        }
        var hValue = parseFloat(this.height.getValue());
        if(isNaN(hValue)) {
            hValue = 0;
        }
        this.width.setValue(wValue + onMove.horizontal);
        this.height.setValue(hValue + onMove.vertical);
    };

    ControlButton.prototype.onMove = function(e) {
        var out = {
            horizontal: 0,
            vertical: 0
        };
        switch (e.keyCode) {
            case 37:
                out.horizontal = -1;
                break;
            case 38:
                out.vertical = -1;
                break;
            case 39:
                out.horizontal = 1;
                break;
            case 40:
                out.vertical = 1;
                break;
        }
        return out;
    };


    ControlButton.prototype.update = function () {
        var pointA = this.obj.pointA;
        var pointB = this.obj.pointB;
        this.x.setValue(pointA.x);
        this.y.setValue(pointA.y);
        if (this.width != null) {
            this.width.setValue(Math.abs(pointA.x - pointB.x));
            this.height.setValue(Math.abs(pointA.y - pointB.y));
        }
        this.highlight.setValue(this.obj.highlight);
        var newAngle = this.obj.angle * 180 / Math.PI;
        this.angle.setValue(Math.round((newAngle >= 0 ? newAngle : 360 + newAngle) * 100) / 100);
    };
    return ControlButton;
});