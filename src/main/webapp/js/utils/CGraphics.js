var CGraphics = {
    /**
     * canvas 2d context
     */
    context: null,
    /**
     * Max bullet distance
     * @var int
     */
    maxDistance: 1000,
    /**
     * How long bullet must be present in map
     * @var int
     */
    lifeTime: 500,
    /**
     * how long projectile will be displayed
     * @var int
     */
    trace: 25,
    color: "white",//"rgba(251, 76, 2, 0.85)",
    skipFrames: 0,
    /**
     * Draw bullet on related canvas
     * @param bullet {x1:int, y1:int, x2:int, y2: int, trace: int, lifeTime: int, created:long(timestamp),realDistance:int,angle:float}
     */
    drawBullet: function(bullet) {
        if(CGraphics.skipFrames > 0) {
            if((bullet.skipFrames !== 0 && !bullet.skipFrames) || bullet.skipFrames >= CGraphics.skipFrames) {
                bullet.skipFrames = 0;
            } else if(bullet.skipFrames < CGraphics.skipFrames) {
                bullet.skipFrames++;
                return
            }
        }
        var maxDistance = bullet.maxDistance || CGraphics.maxDistance;
        if(!bullet.realDistance) {
            bullet.realDistance = Math.sqrt(Math.pow(bullet.x2 - bullet.x1, 2) + Math.pow(bullet.y2 - bullet.y1, 2));
        }
        var realDistance = bullet.realDistance;

        var color = bullet.color || CGraphics.color;
        var trace = bullet.trace || CGraphics.trace;
        var lifeTime = bullet.lifeTime || CGraphics.lifeTime;
        var age = (new Date()).getTime() - bullet.created;
        var renderStart = (maxDistance * age)/lifeTime - (trace / 2);
        if(renderStart < 0) {
            renderStart = 0;
        }
        
        var cos = Math.cos(bullet.angle * Math.PI / 180);
        var sin = Math.sin(bullet.angle * Math.PI / 180);

        var pseudo = {};

        pseudo.x2 = cos * (renderStart + trace) + bullet.x1;
        pseudo.y2 = sin * (renderStart + trace) + bullet.y1;
        var currentDistance = Math.sqrt(Math.pow(pseudo.x2 - bullet.x1, 2) + Math.pow(pseudo.y2 - bullet.y1, 2));
        if(currentDistance > realDistance) {
            return;
        }
        pseudo.x1 = cos * renderStart + bullet.x1;
        pseudo.y1 = sin * renderStart + bullet.y1;
        
       CGraphics.bulletRender(pseudo, color, bullet);
    },
    /**
     * Can be override
     * @param pseudo object
     * @param color string
     * @param bullet object
     */
    bulletRender: function(pseudo, color, bullet) {
        var context = CGraphics.context;
        context.save();
        context.beginPath();
        
        
        context.strokeStyle=color;
        context.moveTo(pseudo.x1, pseudo.y1);
        context.lineTo(pseudo.x2, pseudo.y2);
        context.lineWidth = 1.5;
        context.stroke();


        /*var cos = Math.cos(bullet.angle * Math.PI / 180);
        var sin = Math.sin(bullet.angle * Math.PI / 180);
        var posX = cos * 8+ bullet.x1;
        var posY =  sin * 4 + bullet.y1;
        var rad = 8;
        var grd = context.createRadialGradient(posX, posY, 0, posX, posY, rad);
        grd.addColorStop(0, "white");
        grd.addColorStop(0.2, "orange");
        grd.addColorStop(0.6, "red");
        grd.addColorStop(1, "transparent");
        context.fillStyle = grd;
        context.fillRect(posX - rad, posY - rad, rad * 2, rad * 2);*/
        
        context.restore();
    },
    
    animateImages: function(images, time, callback) {
        var timeChunk = time / images.length;
        var i = 0;
        var interval = setInterval(function() {
            callback(images[i]);
            i++;
            if(i >= images.length) {
                clearInterval(interval);
            }
        }, timeChunk)
    }
};