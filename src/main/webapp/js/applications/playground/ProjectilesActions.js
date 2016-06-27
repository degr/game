var ProjectilesActions = {
    init: function() {
        ProjectilesActions.fire = new Image();
        ProjectilesActions.fire.src = 'images/map/fire.png';

        ProjectilesActions.rocket = new Image();
        ProjectilesActions.rocket.src = 'images/map/rocketBullet.gif';


        /*ProjectilesActions.explosion = new Image();
         ProjectilesActions.explosion.src = 'images/map/explosion.png';*/
        ProjectilesActions.explosion = [];
        for(var i = 1; i <= 20; i++) {
            var image = new Image();
            image.src = 'images/map/explosion/' + i + ".png";
            ProjectilesActions.explosion.push(image);
        }

    }
};
ProjectilesActions.projectileIds = {};
ProjectilesActions.draw = function(projectile, fire) {
    switch (projectile.type) {
        case 'bullet':
            ProjectilesActions.drawBullet(projectile);
            if(!projectile.soundPlayed) {
                projectile.soundPlayed = true;
                SoundUtils.play('sound/minigun.mp3');
            }
            break;
        case 'slug':
            ProjectilesActions.drawBullet(projectile);
            if(!projectile.soundPlayed) {
                projectile.soundPlayed = true;
                SoundUtils.play('sound/sniper.mp3');
            }
            break;
        case 'shot':
            ProjectilesActions.drawBullet(projectile);
            if(!projectile.soundPlayed) {
                projectile.soundPlayed = true;
                SoundUtils.play('sound/shotgun.mp3');
            }
            break;
        case 'flame':
            ProjectilesActions.drawFlame(projectile);
            if(!fire.isFirePlayed) {
                if(!ProjectilesActions.projectileIds[projectile.id]) {
                    ProjectilesActions.projectileIds[projectile.id] = true;
                    fire.isFirePlayed = true;
                    SoundUtils.play('sound/fire.mp3');
                }
            }
            break;
        case 'rocket':
            ProjectilesActions.drawRocket(projectile);
            break;
        case 'blade':
            ProjectilesActions.drawBlade(projectile);
            break;
        case 'explosion':
            ProjectilesActions.drawExplosion(projectile);
            if(!projectile.soundPlayed) {
                projectile.soundPlayed = true;
                SoundUtils.play('sound/explosion.mp3');
            }
            break;
    }
};
ProjectilesActions.drawBullet = function(projectile){
    CGraphics.drawBullet(projectile);
    
};

ProjectilesActions.drawFlame = function(projectile) {
    var context = PlayGround.context;
    context.drawImage(ProjectilesActions.fire, projectile.x1 - 9, projectile.y1 - 9);
    if(PlayGround.drawBounds) {
        context.arc(projectile.x1, projectile.y1, 9, 0, 2 * Math.PI, false);
    }
};
ProjectilesActions.drawExplosion = function(projectile) {
    if(projectile.animationFrame >= ProjectilesActions.explosion.length) {
        return;
    }
    var image = ProjectilesActions.explosion[projectile.animationFrame];
    projectile.animationFrame++;
    var radius = 60;
    var diameter = radius * 2;
    var context = PlayGround.context;
    context.drawImage(image, projectile.x1 - radius, projectile.y1 - radius, diameter, diameter);
    if(PlayGround.drawBounds) {
        context.beginPath();
        context.arc(projectile.x1, projectile.y1, radius, 0, 2 * Math.PI, false);
        context.stroke();
    }
    
    
};

ProjectilesActions.drawRocket = function(projectile) {
    var context = PlayGround.context;
    context.save();
    var x = projectile.x1;
    var y = projectile.y1;
    context.beginPath();
    var angle = projectile.angle + 135;
    context.translate(x,y);
    context.rotate(angle * Math.PI/180);
    context.drawImage(ProjectilesActions.rocket, - 9,  - 9);
    context.restore();
};

ProjectilesActions.drawBlade = function(projectile) {
    /*var context = PlayGround.context;
    context.save();
    context.beginPath();
    context.translate(projectile.x1, projectile.y1);
    var random = Math.floor(Math.random() * 12)+ 8;
    random = 0;
    var randomDirection = Math.floor(Math.random() * 10);
    if(randomDirection > 5) {
        random *= -1;
    }
    
    var shiftX = -10;
    var shiftY = -15;
    context.rotate((projectile.angle + random) * Math.PI / 180);
    context.drawImage(ZoneActions.images.knife, 50, 0, 50, 100, shiftX, shiftY, 20, 32);
    context.restore();*/
};

ProjectilesActions.generateColor = function() {
    switch (Math.floor(Math.random() * 5)) {
        case 0: return 'white';
        case 1: return '#D6E085';
        case 2: return '#E0BD5D';
        case 3: return '#E07929';
        case 4: return '#B5E0DF';
        default : return '#B3E077';
    }
};
ProjectilesActions.decode = function(projectiles) {
    var now = (new Date()).getTime();
    var playShootgun = false;
    var shotgunColor = null;
    for(var i = 0; i < projectiles.length; i++) {
        var data = projectiles[i].split(':');
        var p = {
            id: data[0],
            type: data[1],
            x1: parseInt(data[2]),
            y1: parseInt(data[3]),
            x2: parseInt(data[4]),
            y2: parseInt(data[5]),
            angle: parseInt(data[6]),
            realDistance: null//will be calculated in CGraphics
        };
        
        switch (p.type) {
            case 'slug':
                p.trace = 50;
                PlayGround.instantBullets.push(p);
                p.created = now;
                p.color = ProjectilesActions.generateColor();
                p.lifeTime = 500;
                break;
            case 'bullet':
                PlayGround.instantBullets.push(p);
                p.created = now;
                p.color = ProjectilesActions.generateColor();
                p.trace = 25;
                p.lifeTime = 500;
                break;
            case 'shot':
                p.trace = 15;
                p.lifeTime = 300;
                if(playShootgun) {
                    p.soundPlayed = true;
                } else {
                    playShootgun = true;
                }
                if(shotgunColor == null) {
                    shotgunColor = ProjectilesActions.generateColor();
                }
                p.color = shotgunColor;
                PlayGround.instantBullets.push(p);
                p.created = now;
                break;
            case 'explosion':
                PlayGround.instantBullets.push(p);
                p.created = now;
                p.lifeTime = 1000;
                p.animationFrame = 0;
                break;
            case 'blade':
                PlayGround.instantBullets.push(p);
                p.created = now + 50;
                break;
            default:
                PlayGround.projectiles.push(p);
        }
    }
};