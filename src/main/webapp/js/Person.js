function Person(personDto) {
    for(var key in personDto) {
        this[key] = personDto[key];
    }
}
Person.prototype.image = new Image();
Person.prototype.image.src = 'images/soldier.png';

Person.prototype.draw = function(context) {
    context.save();
    var x = this.x;
    var y = this.y;
    var angle = this.angle + 90;
    context.strokeStyle = this.hexColor;
    context.translate(x,y);
    context.rotate(angle * Math.PI/180);
    context.beginPath();
    context.arc(0, 0, Game.radius, 0, 2 * Math.PI, false);
    context.stroke();
    context.drawImage(this.image, - Game.radius,  - Game.radius);
    context.restore();
};
Person.prototype.getX = function(){
    return this.x;
};
Person.prototype.getY = function(){
    return this.y;
};