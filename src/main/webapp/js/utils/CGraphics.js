Engine.define('CGraphics', (function () {

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
        bulletFlashImages: [],
        smokeImage: new Image()
    };

    (function () {
        for (var i = 0; i < 10; i++) {
            var image = new Image();
            image.src = '/images/map/flash/' + i + ".png";
            CGraphics.bulletFlashImages.push(image);
        }
    })();
    CGraphics.smokeImage.src = "images/map/smoke.png";
    
    /**
     * Draw bullet on related canvas
     * @param bullet object {x1:int, y1:int, x2:int, y2: int, trace: int, lifeTime: int, created:long(timestamp),realDistance:int,angle:float}
     */
    CGraphics.drawBullet = function (bullet) {
        if (CGraphics.skipFrames > 0) {
            if ((bullet.skipFrames !== 0 && !bullet.skipFrames) || bullet.skipFrames >= CGraphics.skipFrames) {
                bullet.skipFrames = 0;
            } else if (bullet.skipFrames < CGraphics.skipFrames) {
                bullet.skipFrames++;
                return
            }
        }
        var maxDistance = bullet.maxDistance || CGraphics.maxDistance;
        if (!bullet.realDistance) {
            bullet.realDistance = Math.sqrt(Math.pow(bullet.x2 - bullet.x1, 2) + Math.pow(bullet.y2 - bullet.y1, 2));
        }
        var realDistance = bullet.realDistance;

        var color = bullet.color || CGraphics.color;
        var trace = bullet.trace || CGraphics.trace;
        var lifeTime = bullet.lifeTime || CGraphics.lifeTime;
        var age = (new Date()).getTime() - bullet.created;
        var renderStart = (maxDistance * age) / lifeTime - (trace / 2);
        if (renderStart < 0) {
            renderStart = 0;
        }

        var cos = Math.cos(bullet.angle * Math.PI / 180);
        var sin = Math.sin(bullet.angle * Math.PI / 180);

        var pseudo = {};

        pseudo.x2 = cos * (renderStart + trace) + bullet.x1;
        pseudo.y2 = sin * (renderStart + trace) + bullet.y1;
        var currentDistance = Math.sqrt(Math.pow(pseudo.x2 - bullet.x1, 2) + Math.pow(pseudo.y2 - bullet.y1, 2));
        CGraphics.drawSmoke(bullet, false);
        if (currentDistance > realDistance) {
            return;
        }
        pseudo.x1 = cos * renderStart + bullet.x1;
        pseudo.y1 = sin * renderStart + bullet.y1;
        pseudo.trace = trace;

        CGraphics.bulletRender(pseudo, color, bullet);
    };
    CGraphics.drawBulletFlash = function (person, shiftX, shiftY) {
        if (person.flash == undefined) {
            person.flash = 0;
        }
        if (person.flash >= CGraphics.bulletFlashImages.length) {
            return false;
        }
        var context = CGraphics.context;
        context.save();
        context.translate(person.x, person.y);
        context.rotate(person.angle * Math.PI / 180);
        context.drawImage(CGraphics.bulletFlashImages[person.flash], shiftX, shiftY);
        context.restore();
        person.flash++;
        return true;
    };
    CGraphics.drawSmoke = function (bullet, isMulty, lifeTime) {
        if (!bullet.smoke) {
            bullet.smoke = [new CGraphics.smoke(bullet.x1, bullet.y1, lifeTime)];
        } else {
            if (isMulty) {
                bullet.smoke.push(new CGraphics.smoke(bullet.x1, bullet.y1, lifeTime));
            }
        }
        var context = CGraphics.context;
        for (var i = 0; i < bullet.smoke.length; i++) {
            var sm = bullet.smoke[i];
            sm.update();
            context.save();
            context.translate(sm.x, sm.y);
            context.rotate(sm.angle * Math.PI / 180);
            context.globalAlpha = sm.alpha;
            context.drawImage(CGraphics.smokeImage, 0 - sm.size / 2, 0 - sm.size / 2, sm.size, sm.size);
            context.restore();
        }
    };
    /**
     * Can be override
     * @param pseudo object
     */
    CGraphics.bulletRender = function (pseudo/*, color, bullet*/) {
        var context = CGraphics.context;
        context.save();
        context.beginPath();
        context.strokeStyle = "white";
        context.moveTo(pseudo.x1, pseudo.y1);
        context.lineTo(pseudo.x2, pseudo.y2);
        context.lineWidth = 1;
        context.stroke();
        context.restore();
    };
    CGraphics.smoke = function (x, y, lifeTime) {
        this.x = x;
        this.y = y;

        this.size = 1;
        this.startSize = 20;
        this.endSize = 160;

        this.angle = Math.random() * 359;

        this.startLife = new Date().getTime();
        this.lifeTime = lifeTime || 1000;
    };
    CGraphics.smoke.prototype.update = function () {
        var lifeTime = new Date().getTime() - this.startLife;
        var lifePerc = ((lifeTime / this.lifeTime) * 100);
        this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * .1);

        this.alpha = 1 - (lifePerc * 0.1);
        this.alpha = Math.max(this.alpha, 0);
    };
    
    return CGraphics;
})());
