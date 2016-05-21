function Person(personDto) {
    for(var key in personDto) {
        this[key] = personDto[key];
    }
}
Person.prototype.image = new Image();
Person.prototype.image.src = 'images/soldier.png';


Person.prototype.getX = function(){
    return this.x;
};
Person.prototype.getY = function(){
    return this.y;
};