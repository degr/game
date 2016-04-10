var PersonActions = {
    buttonTop: false,
    buttonBottom: false,
    buttonLeft: false,
    buttonRight: false,
    directionX: null,
    directionY: null
};

PersonActions.setDirection  = function(direction) {
    Game.socket.send("direction:" + direction);
};
PersonActions.doShot = function(e){
    e = e || window.event;
    e.preventDefault();
    Game.socket.send("shot:" + e.clientX + ":"+ e.clientY);
};
PersonActions.startMovement = function(e){
    var code = e.keyCode;
    if (code > 36 && code < 41) {
        e.preventDefault();
        switch (code) {
            case 37:
                console.log("left 37");
                PersonActions.buttonLeft = true;
                break;
            case 38:
                console.log("top 38");
                PersonActions.buttonTop = true;
                break;
            case 39:
                console.log("right 39");
                PersonActions.buttonRight= true;
                break;
            case 40:
                console.log("bottom 40");
                PersonActions.buttonBottom = true;
                break;
        }
        var direction = PersonActions.handleDirectionAfterButtons();
        PersonActions.setDirection(direction);
    }
};
PersonActions.handleDirectionAfterButtons = function() {
    if(PersonActions.buttonTop && !PersonActions.buttonBottom) {
        PersonActions.directionY = "north";
    } else if(!PersonActions.buttonTop && PersonActions.buttonBottom) {
        PersonActions.directionY = "south";
    } else {
        PersonActions.directionY = null;
    }

    if(PersonActions.buttonLeft && !PersonActions.buttonRight) {
        PersonActions.directionX = "west";
    } else if(!PersonActions.buttonLeft && PersonActions.buttonRight) {
        PersonActions.directionX = "east";
    } else {
        PersonActions.directionX = null;
    }
    if(PersonActions.directionY !== null) {
        if(PersonActions.directionX === null) {
            return PersonActions.directionY
        } else {
            return PersonActions.directionY + "_" + PersonActions.directionX;
        }
    } else if(PersonActions.directionX !== null) {
        return PersonActions.directionX;
    } else {
        return "none";
    }
};
PersonActions.stopMovement = function(e){
    var code = e.keyCode;
    if (code > 36 && code < 41) {
        e.preventDefault();
        switch (code) {
            case 37:
                PersonActions.buttonLeft = false;
                break;
            case 38:
                PersonActions.buttonTop = false;
                break;
            case 39:
                PersonActions.buttonRight = false;
                break;
            case 40:
                PersonActions.buttonBottom = false;
                break;
        }
        var direction = PersonActions.handleDirectionAfterButtons();
        PersonActions.setDirection(direction);
    }
};
PersonActions.updateMouseDirection = function(e){
    e = e || window.event;
    if("undefined" == typeof e.clientX) {
        return;
    }
    Game.xMouse = e.clientX;
    Game.yMouse = e.clientY;
};
