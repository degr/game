var ProjectilesActions = {};
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
    var context = PlayGround.context;
    context.save();
    context.beginPath();
    //context.strokeStyle="rgba(202, 4, 4, 0.55)";
    context.strokeStyle="rgba(251, 76, 2, 0.85)";
    context.moveTo(projectile.x1, projectile.y1);
    context.lineTo(projectile.x2, projectile.y2);
    context.stroke();
    context.restore();
};

ProjectilesActions.drawFlame = function(projectile) {
    var context = PlayGround.context;
    context.drawImage(ProjectilesActions.fire, projectile.x1 - 9, projectile.y1 - 9);
    if(PlayGround.drawBounds) {
        context.arc(projectile.x1, projectile.y1, 9, 0, 2 * Math.PI, false);
    }
};
ProjectilesActions.drawExplosion = function(projectile) {
    var context = PlayGround.context;
    context.drawImage(ProjectilesActions.explosion, projectile.x1 - 60, projectile.y1 - 60, 120, 120);
    if(PlayGround.drawBounds) {
        context.beginPath();
        context.arc(projectile.x1, projectile.y1, 60, 0, 2 * Math.PI, false);
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
ProjectilesActions.decode = function(str) {
    var data = str.split(':');
    return {
        id: data[0],
        type: data[1],
        x1: parseInt(data[2]),
        y1: parseInt(data[3]),
        x2: parseInt(data[4]),
        y2: parseInt(data[5]),
        angle: parseInt(data[6])
    }
};
ProjectilesActions.fire = new Image();
ProjectilesActions.fire.src = 'images/map/fire.png';

ProjectilesActions.rocket = new Image();
ProjectilesActions.rocket.src = 'images/map/rocketBullet.gif';

ProjectilesActions.explosion = new Image();
ProjectilesActions.explosion.src = 'images/map/explosion.png';
