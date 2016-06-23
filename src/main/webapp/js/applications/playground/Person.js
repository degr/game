function Person(id) {
    this.id = id;
}
Person.prototype.image = new Image();
Person.prototype.image.src = 'images/soldier.png';


Person.prototype.getX = function(){
    return this.x;
};
Person.prototype.getY = function(){
    return this.y;
};