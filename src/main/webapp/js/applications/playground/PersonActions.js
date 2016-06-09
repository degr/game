var PersonActions = {
    buttonTop: false,
    buttonBottom: false,
    buttonLeft: false,
    buttonRight: false,
    directionX: null,
    directionY: null,
    angleMistake: 0
};

PersonActions.setDirection  = function(direction) {
    PlayGround.socket.send("direction:" + direction);
};
PersonActions.startFire = function(e){
    if(e) {
        e = e || window.event;
        e.preventDefault();
    }
    if(Chat.active) {
        Chat.active = false;
        document.activeElement.blur();
    } else {
        var gun = '';
        var guns = PlayGround.owner.guns;
        for(var i = 0; i < guns.length; i++) {
            if(guns[i].indexOf(PlayGround.owner.gun + ":") === 0) {
                gun =guns[i];
                break;
            }
        }
        var data = gun.split(":");
        if(data[2] > 0) {
            PlayGround.socket.send("fire:1");
        } else {
            SoundUtils.play('sound/no-ammo.mp3');
        }
    }
};
PersonActions.stopFire = function(e){
    if(e) {
        e = e || window.event;
        e.preventDefault();
    }
    PlayGround.socket.send("fire:0");
};
PersonActions.startMovement = function(e){
    if(!PlayGround.gameStarted || Chat.active || KeyboardSetup.isActive)return;
    e = e || window.event;
    var code = e.keyCode;
    var thisEvent = false;
    switch (code) {
        case Controls.left:
            PersonActions.buttonLeft = true;
            thisEvent = true;
            break;
        case Controls.top:
            PersonActions.buttonTop = true;
            thisEvent = true;
            break;
        case Controls.right:
            PersonActions.buttonRight= true;
            thisEvent = true;
            break;
        case Controls.bottom:
            PersonActions.buttonBottom = true;
            thisEvent = true;
            break;
        default:
    }
    if(thisEvent) {
        e.preventDefault();
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
    if(!PlayGround.gameStarted)return;
    var thisEvent = false;
    if(Chat.active) {
        PersonActions.buttonLeft = false;
        PersonActions.buttonTop = false;
        PersonActions.buttonRight = false;
        PersonActions.buttonBottom = false;
    } else {
        var code = e.keyCode;
        e.preventDefault();
        
        switch (code) {
            case Controls.left:
                PersonActions.buttonLeft = false;
                thisEvent = true;
                break;
            case Controls.top:
                PersonActions.buttonTop = false;
                thisEvent = true;
                break;
            case Controls.right:
                PersonActions.buttonRight = false;
                thisEvent = true;
                break;
            case Controls.bottom:
                PersonActions.buttonBottom = false;
                thisEvent = true;
                break;
        }
    }
    if(thisEvent) {
        var direction = PersonActions.handleDirectionAfterButtons();
        PersonActions.setDirection(direction);
    }
};

PersonActions.updateMouseDirectionByXy = function(x, y, person, offset) {
    if(!PlayGround.gameStarted)return;
    var angle = Math.floor(PersonActions.angle(
        person.x,
        person.y,
        x - offset.left + window.scrollX,
        y - offset.top + window.scrollY
    ));

    if(angle < 0) {
        angle = 360 + angle;
    }
    PlayGround.updatePersonViewAngle(angle);
    return;
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
    if(clockAngle < antiClockAngle ) {
        if(clockAngle <= PersonActions.angleMistake ) {
            PlayGround.updatePersonViewAngle(0);
        } else {
            PlayGround.updatePersonViewAngle(clockAngle > 5 ? 2 : 1);
        }
    } else if(clockAngle > antiClockAngle) {
        if(antiClockAngle <= PersonActions.angleMistake ) {
            PlayGround.updatePersonViewAngle(0);
        } else {
            PlayGround.updatePersonViewAngle(antiClockAngle > 5 ? -2 : -1);
        }
    } else {
        PlayGround.updatePersonViewAngle(0);
    }
};

PersonActions.updateMouseDirection = function(e){
    e = e || window.event;
    if("undefined" == typeof e.clientX) {
        return;
    }
    PlayGround.xMouse = e.clientX;
    PlayGround.yMouse = e.clientY;
    var person = PlayGround.entities[PlayGround.owner ? PlayGround.owner.id : null];
    if(person) {
        PersonActions.updateMouseDirectionByXy(
            e.clientX,
            e.clientY,
            person,
            PlayGround.canvasOffset
        );
    }
};
PersonActions.angle = function(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    return theta;
};
PersonActions.drawPerson = function(person) {
    var context = PlayGround.context;
    var x = person.x;
    var y = person.y;
    var angle = person.angle + 90;
    context.save();
    context.beginPath();
    context.translate(x,y);
    context.rotate((angle - 90) * Math.PI / 180);
    if(person.gun != 'knife' && person.gun != 'pistol') {
        context.drawImage(ZoneActions.images[person.gun], -6, -14)
    } 

    context.restore();



    context.save();
    context.beginPath();
    context.strokeStyle = person.hexColor;
    context.translate(x,y);
    if(person.reload) {
        context.drawImage(PersonActions.reload, + PlayGround.radius + 4,  - PlayGround.radius);
    }
    context.rotate(angle * Math.PI/180);
    if(PlayGround.drawBounds) {
        context.arc(0, 0, PlayGround.radius, 0, 2 * Math.PI, false);
    }
    context.stroke();
    if(person.gun == 'knife' || person.gun == 'pistol') {
        context.drawImage(PersonActions.personOld, - PlayGround.radius - 8,  - PlayGround.radius - 3, 56, 56);
    } else {
        context.drawImage(person.image, - PlayGround.radius - 8,  - PlayGround.radius - 3, 56, 56);
    }

    context.restore();
    
    
    if(PlayGround.showNames) {
        context.strokeText(person.name, x - 10, y + 27);
    }

};

PersonActions.mapPersonFromResponse = function (str) {
    var data = str.split(":");
    return {
        id: parseInt(data[0]),
        name: decodeURIComponent(data[1]),
        color: data[2],
        reload: data[3] == 1,
        gun: data[4],
        x: parseInt(data[5]),
        y: parseInt(data[6]),
        angle: parseInt(data[7])
    }
};

PersonActions.personOld = new Image();
PersonActions.personOld.src = 'images/soldier1.png';
PersonActions.reload = new Image();
PersonActions.reload.src = 'images/map/reload.png';