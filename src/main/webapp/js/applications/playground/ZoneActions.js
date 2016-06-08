var ZoneActions = {
    images: {},
    init: function() {
        ZoneActions.images.armor = new Image();
        ZoneActions.images.armor.src = 'images/map/armor.png';
        ZoneActions.images.assault = new Image();
        ZoneActions.images.assault.src = 'images/map/assault.png';
        ZoneActions.images.flamethrower = new Image();
        ZoneActions.images.flamethrower.src = 'images/map/flame.png';
        ZoneActions.images.helm = new Image();
        ZoneActions.images.helm.src = 'images/map/helm.jpg';
        ZoneActions.images.medkit = new Image();
        ZoneActions.images.medkit.src = 'images/map/medkit.png';
        ZoneActions.images.minigun = new Image();
        ZoneActions.images.minigun.src = 'images/map/minigun.png';
        ZoneActions.images.rocket = new Image();
        ZoneActions.images.rocket.src = 'images/map/rocket.png';
        ZoneActions.images.shotgun = new Image();
        ZoneActions.images.shotgun.src = 'images/map/shotgun.png';
        ZoneActions.images.sniper = new Image();
        ZoneActions.images.sniper.src = 'images/map/sniper.png';
        ZoneActions.images.pistol = new Image();
        ZoneActions.images.pistol.src = 'images/map/pistol.jpg';
        ZoneActions.images.wall = new Image();
        ZoneActions.images.wall.src = 'images/map/wall.jpg';
    },
    drawZone: function(zone) {
        var context = PlayGround.context;
        context.beginPath();
        switch (zone.type) {
            case 'respawn':
                context.fillStyle = 'rgba(129, 195, 114, 0.5)';
                context.fillRect(zone.x, zone.y, zone.width, zone.height);
                break;
            case "shotgun":
            case "assault":
            case "sniper":
            case "minigun":
            case "rocket":
            case "flamethrower":
            case "medkit":
            case "armor":
            case "helm":
                ZoneActions.drawImage(zone);
                break;
            case 'wall':
                context.drawImage(ZoneActions.images.wall, zone.x, zone.y, zone.width, zone.height);
                break;
            case 'tiled':
                if(!ZoneActions.images[zone.tileId]) {
                    var image = new Image();
                    image.src = PlayGround.uploadPath + zone.customSprite;
                    ZoneActions.images[zone.tileId] = image;
                }
                try {

                    if(zone.tileset) {
                        context.drawImage(ZoneActions.images[zone.tileId], zone.shiftX, zone.shiftY, zone.width, zone.height, zone.x, zone.y, zone.width, zone.height);
                    } else {
                        context.drawImage(ZoneActions.images[zone.tileId], zone.x, zone.y, zone.width, zone.height);
                    }
                        
                } catch (e) {
                    context.drawImage(ZoneActions.images.wall, zone.x, zone.y, zone.width, zone.height);
                }
                
                break;
            default:
                context.strokeStyle = '#000000';
                context.rect(zone.x, zone.y, zone.width, zone.height);
                context.stroke();
                context.strokeText(zone.type, zone.x + 3, zone.y + 20, zone.width - 6);
        }
        //
    },
    drawImage: function(zone) {
        var context = PlayGround.context;
        if(zone.available) {
            var size = 48;
            var shift = (size - 40) / 2;
            context.drawImage(ZoneActions.images[zone.type], zone.x - shift, zone.y - shift, size, size);
        }
        if(PlayGround.drawBounds) {
            context.fillStyle = 'rgba(138, 221, 255, 0.55)';
            context.fillRect(zone.x, zone.y, zone.width, zone.height);
        }
    }
};


