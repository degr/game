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
PersonActions.startFire = function(e){
    e = e || window.event;
    e.preventDefault();
    Game.socket.send("fire:1");
};
PersonActions.stopFire = function(e){
    e = e || window.event;
    e.preventDefault();
    Game.socket.send("fire:0");
};
PersonActions.startMovement = function(e){
    e = e || window.event;
    var code = e.keyCode;
    if (code > 36 && code < 41) {
        e.preventDefault();
        switch (code) {
            case Controls.left:
                PersonActions.buttonLeft = true;
                break;
            case Controls.top:
                PersonActions.buttonTop = true;
                break;
            case Controls.right:
                PersonActions.buttonRight= true;
                break;
            case Controls.botton:
                PersonActions.buttonBottom = true;
                break;
            default:
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

PersonActions.updateMouseDirectionByXy = function(x, y, person) {
    var angle = Math.floor(PersonActions.angle(person.x, person.y, x, y));
    var pa = person.angle;
    if(pa > 180) {
        pa = pa - 360;
    }
    var clockAngle = null;
    var antiClockAngle = null;
    if(pa >= 0) {
        if(angle >= 0) {
            if(angle > pa) {
                clockAngle = angle - pa;
            } else if (angle < pa) {
                antiClockAngle = pa - angle;
            } else {
                clockAngle = 180;
            }
        } else {
            antiClockAngle = pa + (-1 * angle);
        }
    } else {
        if(angle >= 0) {
            clockAngle = angle + (-1 * pa);
        } else {
            if(angle < pa) {
                antiClockAngle = (angle - pa) * -1;
            } else if (angle > pa) {
                clockAngle = (pa - angle) * -1;
            } else {
                clockAngle = 180;
            }
        }
    }
    if(clockAngle == null) {
        clockAngle = 360 - antiClockAngle;
    } else {
        antiClockAngle = 360 - clockAngle;
    }
    if(clockAngle < antiClockAngle) {
        Game.updatePersonViewAngle(clockAngle > 5 ? 2 : 1);
    } else if(clockAngle > antiClockAngle) {
        Game.updatePersonViewAngle(antiClockAngle > 5 ? -2 : -1);
    } else {
        Game.updatePersonViewAngle(0);
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
