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
    context.beginPath();
    context.strokeStyle = 'red';
    context.arc(projectile.x1, projectile.x2, PlayGround.fireRadius, 0, 2 * Math.PI, false);
    context.stroke();
}

ProjectilesActions.drawRocket = function(projectile) {
    var context = PlayGround.context;
    context.beginPath();
    context.strokeStyle = 'red';
    context.arc(projectile.x1, projectile.x2, PlayGround.rocketRadius, 0, 2 * Math.PI, false);
    context.stroke();
}

ProjectilesActions.drawBlade = function(projectile) {
    var context = PlayGround.context;
    context.beginPath();
    context.strokeStyle = 'blue';
    context.arc(projectile.x1, projectile.x2, PlayGround.fireRadius, 0, 2 * Math.PI, false);
    context.stroke();
}