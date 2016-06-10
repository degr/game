var PersonActions = {
    buttonTop: false,
    buttonBottom: false,
    buttonLeft: false,
    buttonRight: false,
    directionX: null,
    directionY: null,
    noPassiveReload: false
};
PersonActions.updatePassiveReload = function(value) {
    localStorage.setItem('no_passive_reload', value);
    PersonActions.noPassiveReload = value;
    PlayGround.socket.send('noPassiveReload:' + (value ? '1' : '0'));
};
PersonActions.init = function() {
    var noPassivereload = localStorage.getItem('no_passive_reload');
    PersonActions.noPassiveReload = noPassivereload === 'true';
}

PersonActions.setDirection  = function(direction) {
    PlayGround.socket.send("direction:" + direction);
};
PersonActions.doReload = function(e){
    if(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
    }
    PlayGround.socket.send("reload");
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
        if(data[2] <= 0) {
            SoundUtils.play('sound/no-ammo.mp3');
        }
        //prevent reload stacking
        PlayGround.socket.send("fire:1");
    }
};
PersonActions.stopFire = function(e){
    if(e) {
        e = e || window.event;
        e.preventDefault();
    }
    PlayGround.socket.send("fire:0");
};
PersonActions.onKeyDown = function(e){
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
        case Controls.reload:
            PersonActions.doReload(e);
            return;
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