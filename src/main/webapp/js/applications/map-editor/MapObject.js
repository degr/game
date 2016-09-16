Engine.define('MapObject', ['Dom'], function(){
    function MapObject(type) {
        this.type = type;
        this.pointA = {x: 0, y: 0};
        this.pointB = {x: 0, y: 0};
        this.highlight = false;
        this.customSprite = null;
        this.angle = 0;
        this.stepX = 0;
        this.stepY = 0;
        this.tileset = false;
        this.tileId = 0;
    }
    return MapObject;
});