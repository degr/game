Engine.define('Person', (function () {
    function Person(id) {
        this.id = id;
        this.hexColor = '';
    }

    Person.prototype.image = new Image();
    Person.prototype.image.src = 'images/soldier.png';


    Person.prototype.getX = function () {
        return this.x;
    };
    Person.prototype.getY = function () {
        return this.y;
    };
    return Person
}));