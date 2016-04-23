var ProjectilesActions = {};
ProjectilesActions.draw = function(projectile) {
    var context = Game.context;
    context.beginPath();
    context.strokeStyle="rgba(255, 189, 0, " + ((projectile.creationTime + projectile.lifeTime - projectile.now) / projectile.lifeTime) + ")";
    context.moveTo(projectile.xStart, projectile.yStart);
    context.lineTo(projectile.xEnd, projectile.yEnd);
    context.stroke();
};