function Person() {
    this.location = {x:0, y:0};
    this.hexColor = null;
}
Person.prototype.image = new Image();
Person.prototype.image.src = 'images/soldier.png';


Person.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.location.x, this.location.y, Game.radius, 0, 2 * Math.PI, false);
    //context.fillStyle = this.hexColor;
    //context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.drawImage(this.image, this.location.x - Game.radius, this.location.y - Game.radius)
};
Person.prototype.getX = function(){
    return this.location.x;
};
Person.prototype.getY = function(){
    return this.location.y;
};