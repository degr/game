var ProjectilesActions = {};
ProjectilesActions.draw = function(projectile) {
    var context = Game.context;
    context.beginPath();
    context.strokeStyle="red";
    context.moveTo(projectile.xStart, projectile.yStart);
    context.lineTo(projectile.xEnd, projectile.yEnd);
    context.stroke();
};