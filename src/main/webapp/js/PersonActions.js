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
                PersonActions.buttonLeft = true;
                break;
            case 38:
                PersonActions.buttonTop = true;
                break;
            case 39:
                PersonActions.buttonRight= true;
                break;
            case 40:
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

PersonActions._quadrantCalculation = function (angle, pa, same) {
    if(angle > pa - (same ? 0 : 180)) {
        Game.updatePersonViewAngle(same ? 1 : -1);
    } else if(angle < pa - (same ? 0 : 90)) {
        Game.updatePersonViewAngle(same ? -1 : 1);
    } else {
        Game.updatePersonViewAngle(0);
    }
};
PersonActions.updateMouseDirectionByXy = function(x, y, person) {
    var angle = Math.floor(PersonActions.angle(person.x, person.y, x, y));
    if(angle < 0) {
        angle = 360 + angle;
    }
    Game.angle = angle;
    var pa = person.angle;
    if(pa >= 0 && pa <= 90) {
        if(angle > 0 && angle <= 90) {
            PersonActions._quadrantCalculation(angle, pa, true);
        } else if (angle > 90 && angle <= 180) {
            Game.updatePersonViewAngle(1)
        } else if (angle > 180 && angle <= 270) {
            PersonActions._quadrantCalculation(angle, pa, false);
        } else {
            Game.updatePersonViewAngle(-1)
        }
    } else if (pa > 90 && pa <= 180) {
        if(angle > 0 && angle <= 90) {
            Game.updatePersonViewAngle(-1)
        } else if (angle > 90 && angle <= 180) {
            PersonActions._quadrantCalculation(angle, pa, true);
        } else if (angle > 180 && angle <= 270) {
            Game.updatePersonViewAngle(1)
        } else {
            PersonActions._quadrantCalculation(angle, pa, false);
        }
    } else if (pa > 180 && pa <= 270) {
        if(angle > 0 && angle <= 90) {
            PersonActions._quadrantCalculation(angle, pa, false);
        } else if (angle > 90 && angle <= 180) {
            Game.updatePersonViewAngle(-1)
        } else if (angle > 180 && angle <= 270) {
            PersonActions._quadrantCalculation(angle, pa, true);
        } else {
            Game.updatePersonViewAngle(1)
        }
    } else {
        if(angle > 0 && angle <= 90) {
            Game.updatePersonViewAngle(1)
        } else if (angle > 90 && angle <= 180) {
            PersonActions._quadrantCalculation(angle, pa, false);
        } else if (angle > 180 && angle <= 270) {
            Game.updatePersonViewAngle(-1)
        } else {
            PersonActions._quadrantCalculation(angle, pa, true);
        }
    }
};

PersonActions.updateMouseDirection = function(e){
    e = e || window.event;
    if("undefined" == typeof e.clientX) {
        return;
    }
    Game.xMouse = e.clientX;
    Game.yMouse = e.clientY;
    var person = Game.getPerson();
    if(person) {
        PersonActions.updateMouseDirectionByXy(e.clientX, e.clientY, person);
    }
};
PersonActions.angle = function(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
};
