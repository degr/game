Engine.define('ProjectilesActions', 'SoundUtils', (function () {

    var SoundUtils = Engine.require('SoundUtils');

    var ProjectilesActions = {

        /**
         * @var PlayGround
         */
        playGround: null,
        
        init: function () {
            ProjectilesActions.rocket = new Image();
            ProjectilesActions.rocket.src = 'images/map/rocketBullet.png';
            var image, i;
            ProjectilesActions.explosion = [];
            for (i = 1; i <= 20; i++) {
                image = new Image();
                image.src = 'images/map/explosion/' + i + ".png";
                ProjectilesActions.explosion.push(image);
            }
            ProjectilesActions.flame = [[], []];
            for (i = 0; i <= 16; i++) {
                image = new Image();
                image.src = 'images/map/fire/0/' + i + ".png";
                ProjectilesActions.flame[0].push(image);
            }
            for (i = 0; i <= 17; i++) {
                image = new Image();
                image.src = 'images/map/fire/1/' + i + ".png";
                ProjectilesActions.flame[1].push(image);
            }
        }
    };
    ProjectilesActions.projectileIds = {};
    ProjectilesActions.draw = function (projectile, fire) {
        switch (projectile.type) {
            case 'bullet':
                ProjectilesActions.drawBullet(projectile);
                if (!projectile.soundPlayed) {
                    projectile.soundPlayed = true;
                    SoundUtils.play('sound/minigun.mp3');
                }
                break;
            case 'slug':
                ProjectilesActions.drawBullet(projectile);
                if (!projectile.soundPlayed) {
                    projectile.soundPlayed = true;
                    SoundUtils.play('sound/sniper.mp3');
                }
                break;
            case 'shot':
                ProjectilesActions.drawBullet(projectile);
                if (!projectile.soundPlayed) {
                    projectile.soundPlayed = true;
                    SoundUtils.play('sound/shotgun.mp3');
                }
                break;
            case 'flame':
                ProjectilesActions.drawFlame(projectile);
                if (!fire.isFirePlayed) {
                    if (!ProjectilesActions.projectileIds[projectile.id]) {
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
                if (!projectile.soundPlayed) {
                    projectile.soundPlayed = true;
                    SoundUtils.play('sound/explosion.mp3');
                }
                break;
        }
    };
    ProjectilesActions.drawBullet = function (projectile) {
        if (!projectile.isFixed) {
            projectile.isFixed = true;

            var playGround = ProjectilesActions.playGround;

            var entity = playGround.entities[projectile.personId];
            if (entity) {
                entity.recoil = 2;
                if (!entity.onFire) {
                    entity.onFire = true;
                    entity.flash = 0;
                }
            }

            var renderStart = playGround.radius;
            var cos = Math.cos(projectile.angle * Math.PI / 180);
            var sin = Math.sin(projectile.angle * Math.PI / 180);
            projectile.x1 = cos * renderStart + projectile.x1;
            projectile.y1 = sin * renderStart + projectile.y1;
        }

        var CGraphics = Engine.require('CGraphics');
        CGraphics.drawBullet(projectile);

    };

    ProjectilesActions.drawFlame = function (projectile) {
        var playGround = ProjectilesActions.playGround;
        var context = playGround.context;
        var frameSet = ProjectilesActions.flame[projectile.frameSet];
        if (projectile.animationFrame >= frameSet.length) {
            projectile.animationFrame = 0;
        }
        var radius = 12;
        var diameter = radius * 2;
        context.drawImage(frameSet[projectile.animationFrame], projectile.x1 - 12, projectile.y1 - 12, diameter, diameter);
        projectile.animationFrame++;
        projectile.x1 += projectile.x2;
        projectile.y1 += projectile.y2;

        if (playGround.drawBounds) {
            context.arc(projectile.x1, projectile.y1, 9, 0, 2 * Math.PI, false);
        }
    };
    ProjectilesActions.drawExplosion = function (projectile) {
        if (projectile.animationFrame >= ProjectilesActions.explosion.length) {
            return;
        }
        var playGround = ProjectilesActions.playGround;
        var image = ProjectilesActions.explosion[projectile.animationFrame];
        projectile.animationFrame++;
        var radius = 60;
        var diameter = radius * 2;
        var context = playGround.context;
        context.drawImage(image, projectile.x1 - radius, projectile.y1 - radius, diameter, diameter);
        if (playGround.drawBounds) {
            context.beginPath();
            context.arc(projectile.x1, projectile.y1, radius, 0, 2 * Math.PI, false);
            context.stroke();
        }
    };

    ProjectilesActions.drawRocket = function (projectile) {
        var context = ProjectilesActions.playGround.context;
        context.save();
        var x = projectile.x1;
        var y = projectile.y1;
        projectile.x1 += projectile.x2;
        projectile.y1 += projectile.y2;

        context.beginPath();
        var angle = projectile.angle + 90;
        context.translate(x, y);
        context.rotate(angle * Math.PI / 180);
        var smokeShift = -27;
        var width = 12;
        var height = 26;
        context.drawImage(ProjectilesActions.rocket, -(width / 2), -(height / 2) + smokeShift, width, height);
        context.restore();

        var CGraphics = Engine.require('CGraphics');
        CGraphics.drawSmoke(projectile, true, 3000);
    };

    ProjectilesActions.drawBlade = function (projectile) {
    };

    ProjectilesActions.generateColor = function () {
        return 'white';
    };
    ProjectilesActions.decode = function (projectiles) {
        var playGround = ProjectilesActions.playGround;
        var now = (new Date()).getTime();
        var playShootgun = false;
        var shotgunColor = null;
        if(projectiles && projectiles.length) {
            for (var i = 0; i < projectiles.length; i++) {
                var data = projectiles[i].split(':');
                var p = {
                    id: data[0],
                    type: data[1],
                    x1: parseInt(data[2]),
                    y1: parseInt(data[3]),
                    x2: parseFloat(data[4]),
                    y2: parseFloat(data[5]),
                    angle: parseInt(data[6]),
                    personId: parseInt(data[7]),
                    realDistance: null//will be calculated in CGraphics

                };

                switch (p.type) {
                    case 'slug':
                        p.trace = 50;
                        playGround.instantBullets.push(p);
                        p.created = now;
                        p.color = ProjectilesActions.generateColor();
                        p.lifeTime = 300;
                        p.maxDistance = 700;
                        break;
                    case 'b':
                    case 'bullet':
                        playGround.instantBullets.push(p);
                        p.type = 'bullet';
                        p.created = now;
                        p.color = ProjectilesActions.generateColor();
                        p.trace = 25;
                        p.lifeTime = 300;
                        p.maxDistance = 450;
                        break;
                    case 's':
                    case 'shot':
                        p.type = 'shot';
                        p.trace = 15;
                        p.lifeTime = 200;
                        p.maxDistance = 300;
                        if (playShootgun) {
                            p.soundPlayed = true;
                        } else {
                            playShootgun = true;
                        }
                        if (shotgunColor == null) {
                            shotgunColor = ProjectilesActions.generateColor();
                        }
                        p.color = shotgunColor;
                        playGround.instantBullets.push(p);
                        p.created = now;
                        break;
                    case 'explosion':
                        playGround.instantBullets.push(p);
                        p.created = now;
                        p.lifeTime = 1000;
                        p.animationFrame = 0;
                        break;
                    case 'blade':
                        playGround.instantBullets.push(p);
                        var person = playGround.entities[p.personId];
                        if (person) {
                            if (!person.knifeLifeCycle) {
                                if (Math.random() > 0.5) {
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
                    case 'rr':
                    case 'fr':
                        delete playGround.motionBullets[p.x1];
                        break;
                    case 'rocket':
                        p.type = 'rocket';
                        var oldRocket = playGround.motionBullets[p.id];
                        if (oldRocket) {
                            p.smoke = oldRocket.smoke;
                        }
                        playGround.motionBullets[p.id] = p;
                        break;
                        break;
                    case 'f':
                    case 'flame':
                        p.type = 'flame';
                        var old = playGround.motionBullets[p.id];
                        if (old) {
                            p.animationFrame = old.animationFrame + 1;
                            p.frameSet = old.frameSet;
                        } else {
                            p.frameSet = Math.floor(Math.random() * ProjectilesActions.flame.length);
                            p.animationFrame = 0;
                        }
                        playGround.motionBullets[p.id] = p;
                        break;
                    default:
                        playGround.projectiles.push(p);
                }
            }
        }

        for(var k in playGround.motionBullets) {
            playGround.projectiles.push(playGround.motionBullets[k]);
        }

    };
    return ProjectilesActions
}));