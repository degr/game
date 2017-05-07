Engine.define('ZoneActions', ['Weapons', 'Config'], (function () {

    var Weapons = Engine.require("Weapons");
    var Config = Engine.require("Config");
    
    var ZoneActions = {
        images: {},
        wallPattern: null,
        weapons: Weapons.getInstance(),
        /**
         * @var PlayGround
         */
        playGround: null,
        init: function () {
            var me = this;
            
            for(var weapon in ZoneActions.weapons) {
                if(ZoneActions.weapons.hasOwnProperty(weapon)) {
                    ZoneActions.images[ZoneActions.weapons[weapon].type] = ZoneActions.weapons[weapon].image;
                }
            }
            
            ZoneActions.images.armor = new Image();
            ZoneActions.images.armor.src = 'images/map/armor.png';
            ZoneActions.images.helm = new Image();
            ZoneActions.images.helm.src = 'images/map/helm.png';
            ZoneActions.images.medkit = new Image();
            ZoneActions.images.medkit.src = 'images/map/medkit.png';
            ZoneActions.images.wall = new Image();
            ZoneActions.images.wall.onload = function () {
                var playGround = me.playGround;
                ZoneActions.wallPattern = playGround.context.createPattern(me.images.wall, 'repeat');
            };
            ZoneActions.images.wall.src = 'images/map/wall.png';
            ZoneActions.images.flag_blue = new Image();
            ZoneActions.images.flag_blue.src = 'images/teams/flag_blue.png';
            ZoneActions.images.flag_red = new Image();
            ZoneActions.images.flag_red.src = 'images/teams/flag_red.png';

        },
        drawZone: function (zone) {
            var playGround = ZoneActions.playGround;
            var context = playGround.context;
            context.save();
            context.beginPath();
            var startX = zone.width / 2;
            var startY = zone.height / 2;
            context.translate(zone.x + startX, zone.y + startY);
            if(zone.angle != 0) {
                context.rotate(zone.angle);
            }
            switch (zone.type) {
                case 'respawn':
                    context.fillStyle = 'rgba(129, 195, 114, 0.5)';
                    context.fillRect(-startX, -startY, zone.width, zone.height);
                    break;
                case 'respawn_blue':
                    context.fillStyle = 'rgba(54, 159, 236, 0.41)';
                    context.fillRect(-startX, -startY, zone.width, zone.height);
                    break;
                case 'respawn_red':
                    context.fillStyle = 'rgba(210, 63, 63, 0.41)';
                    context.fillRect(-startX, -startY, zone.width, zone.height);
                    break;
                case 'flag_blue':
                    context.fillStyle = 'rgb(54, 159, 236)';
                    context.fillRect(-startX, -startY, zone.width, zone.height);
                    /* fall through */
                case 'flag_blue_temp':
                    if (zone.available) {
                        context.drawImage(ZoneActions.images.flag_blue, -startX, -startY);
                    }
                    break;
                case 'flag_red':
                    context.fillStyle = 'rgb(210, 63, 63)';
                    context.fillRect(-startX, -startY, zone.width, zone.height);
                    /* fall through */
                case 'flag_red_temp':
                    if (zone.available) {
                        context.drawImage(ZoneActions.images.flag_red, -startX, -startY);
                    }
                    break;
                case "pistol":
                case "shotgun":
                case "assault":
                case "sniper":
                case "minigun":
                case "rocket":
                case "flamethrower":
                case "medkit":
                case "armor":
                case "helm":
                    ZoneActions.drawImage(zone, startX, startY);
                    break;
                case 'wall':
                    context.fillStyle = ZoneActions.wallPattern;
                    context.fillRect(-startX, -startY, zone.width, zone.height);
                    break;
                case 'tiled':
                    if (!ZoneActions.images[zone.tileId]) {
                        var image = new Image();
                        image.src = Config.uploadPath + zone.customSprite;
                        ZoneActions.images[zone.tileId] = image;
                    }
                    try {
                        if (zone.tileset) {
                            context.drawImage(ZoneActions.images[zone.tileId], zone.shiftX, zone.shiftY, zone.width, zone.height, -startX, -startY, zone.width, zone.height);
                        } else {
                            context.drawImage(ZoneActions.images[zone.tileId], -startX, -startY, zone.width, zone.height);
                        }
                    } catch (e) {
                        context.fillStyle = ZoneActions.wallPattern;
                        context.fillRect(-startX, -startY, zone.width, zone.height);
                    }

                    break;
                default:
                    context.strokeStyle = '#000000';
                    context.rect(-startX, -startY, zone.width, zone.height);
                    context.stroke();
                    context.strokeText(zone.type, zone.x + 3, zone.y + 20, zone.width - 6);
            }
            context.restore();
            //
        },
        decode: function (str) {
            var data = str.split(':');
            return {
                type: data[0],
                x: parseInt(data[1]),
                y: parseInt(data[2]),
                width: parseInt(data[3]),
                height: parseInt(data[4])
            }
        },
        drawImage: function (zone, startX, startY) {
            var playGround = ZoneActions.playGround;
            var context = playGround.context;
            if (zone.available) {
                var size = 40;
                context.drawImage(ZoneActions.images[zone.type], -startX, -startY, size, size);
            }
            if (playGround.drawBounds) {
                context.fillStyle = 'rgba(138, 221, 255, 0.55)';
                context.fillRect(-startX, -startY, zone.width, zone.height);
            }
        }
    };
    return ZoneActions
}));


