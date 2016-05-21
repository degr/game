var ProjectilesActions = {};
ProjectilesActions.draw = function(projectile) {
    switch (projectile.type) {
        case 'bullet':
        case 'slug':
        case 'shot':
            ProjectilesActions.drawBullet(projectile);
            break;
        case 'flame':
            ProjectilesActions.drawFlame(projectile);
            break;
        case 'rocket':
            ProjectilesActions.drawRocket(projectile);
            break;
        case 'blade':
            ProjectilesActions.drawBlade(projectile);
    }

};
ProjectilesActions.drawBullet = function(projectile){
    var context = PlayGround.context;
    context.beginPath();
    context.strokeStyle="rgba(255, 189, 0, " + ((projectile.creationTime + projectile.lifeTime - projectile.now) / projectile.lifeTime) + ")";
    context.moveTo(projectile.x1, projectile.y1);
    context.lineTo(projectile.x2, projectile.y2);
    context.stroke();
};

ProjectilesActions.drawFlame = function(projectile) {
    var context = PlayGround.context;
    context.drawImage(ProjectilesActions.fire, projectile.x1 - 9, projectile.y1 - 9);
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
    var context = PlayGround.context;
    context.beginPath();
    context.strokeStyle = 'blue';
    context.arc(projectile.x1, projectile.y1, PlayGround.fireRadius, 0, 2 * Math.PI, false);
    context.stroke();
};
ProjectilesActions.fire = new Image();
ProjectilesActions.fire.src = 'images/map/fire.png';

ProjectilesActions.rocket = new Image();
ProjectilesActions.rocket.src = 'images/map/rocketBullet.gif';
