var ProjectilesActions = {
    init: function() {
        ProjectilesActions.rocket = new Image();
        ProjectilesActions.rocket.src = 'images/map/rocketBullet.gif';
        var image, i;

        /*ProjectilesActions.explosion = new Image();
         ProjectilesActions.explosion.src = 'images/map/explosion.png';*/
        ProjectilesActions.explosion = [];
        for(i = 1; i <= 20; i++) {
            image = new Image();
            image.src = 'images/map/explosion/' + i + ".png";
            ProjectilesActions.explosion.push(image);
        }
        ProjectilesActions.flame = [[], []];
        for(i = 0; i <= 16; i++) {
            image = new Image();
            image.src = 'images/map/fire/0/' + i + ".png";
            ProjectilesActions.flame[0].push(image);
        }
        for(i = 0; i <= 17; i++) {
            image = new Image();
            image.src = 'images/map/fire/1/' + i + ".png";
            ProjectilesActions.flame[1].push(image);
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
    if(!projectile.isFixed) {
        projectile.isFixed = true;


        for(var k in PlayGround.entities) {
            var entity = PlayGround.entities[projectile.personId];
            if(entity) {
                entity.recoil = 2;
                if(!entity.onFire) {
                    entity.onFire = true;
                    entity.flash = 0;
                }
            }
        }
        var renderStart = PlayGround.radius;
        var cos = Math.cos(projectile.angle * Math.PI / 180);
        var sin = Math.sin(projectile.angle * Math.PI / 180);
        projectile.x1 = cos * renderStart + projectile.x1;
        projectile.y1 = sin * renderStart + projectile.y1;
    }
    CGraphics.drawBullet(projectile);
    
};

ProjectilesActions.drawFlame = function(projectile) {
    var context = PlayGround.context;
    var frameSet = ProjectilesActions.flame[projectile.frameSet];
    if(projectile.animationFrame >= frameSet.length) {
        projectile.animationFrame = 0;
    }
    var radius = 12;
    var diameter = radius * 2;
    context.drawImage(frameSet[projectile.animationFrame], projectile.x1 - 12, projectile.y1 - 12, diameter, diameter);
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
};

ProjectilesActions.generateColor = function() {
    return 'white';
};
ProjectilesActions.decode = function(projectiles) {
    var now = (new Date()).getTime();
    var playShootgun = false;
    var shotgunColor = null;
    var existingFire = [];
    for(var fireKey in PlayGround.fireBullets) {
        existingFire.push(PlayGround.fireBullets[fireKey].id);
    }
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
            personId: parseInt(data[7]),
            realDistance: null//will be calculated in CGraphics
            
        };
        
        switch (p.type) {
            case 'slug':
                p.trace = 50;
                PlayGround.instantBullets.push(p);
                p.created = now;
                p.color = ProjectilesActions.generateColor();
                p.lifeTime = 300;
                p.maxDistance = 700;
                break;
            case 'bullet':
                PlayGround.instantBullets.push(p);
                p.created = now;
                p.color = ProjectilesActions.generateColor();
                p.trace = 25;
                p.lifeTime = 300;
                p.maxDistance = 450;
                break;
            case 'shot':
                p.trace = 15;
                p.lifeTime = 200;
                p.maxDistance = 300;
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
                var person = PlayGround.entities[p.personId];
                if(person) {
                    if (!person.knifeLifeCycle) {
                        if(Math.random() > 0.5) {
                            person.isPiercingKnife = true;
                            person.knifeShift = 0;
                        } else {
                            person.isPiercingKnife = false;
                            person.knifeAngle = 0;
                        }
                        person.knifeLifeCycle = 1;
                    }
                }
                p.created = now + 50;
                break;
            case 'flame':
                var old = PlayGround.fireBullets[p.id];
                if(old) {
                    existingFire.splice(existingFire.indexOf(p.id), 1);
                    p.animationFrame = old.animationFrame + 1;
                    p.frameSet = old.frameSet
                } else {
                    p.frameSet = Math.floor(Math.random() * ProjectilesActions.flame.length);
                    p.animationFrame = 0;
                }
                PlayGround.fireBullets[p.id] = p;
                PlayGround.projectiles.push(p);
                break;
            default:
                PlayGround.projectiles.push(p);
        }
    }
    for(var i = 0; i < existingFire.length; i++) {
        delete PlayGround.fireBullets[i];
    }
};