Engine.define('PersonActions', ['SoundUtils', 'ZoneActions', 'Controls'], (function () {

    var SoundUtils = Engine.require('SoundUtils');
    var ZoneActions = Engine.require('ZoneActions');
    var Controls = Engine.require('Controls');
    var Weapons = Engine.require('Weapons');

    var PersonActions = {
        buttonTop: false,
        buttonBottom: false,
        buttonLeft: false,
        buttonRight: false,
        directionX: null,
        directionY: null,
        noPassiveReload: false,
        /**
         * @var PlayGround
         */
        playGround: null
    };
    PersonActions.run = [];
    (function () {
        for (var i = 0; i < 20; i++) {
            var image = new Image();
            image.src = 'images/person/run/' + i + ".png";
            PersonActions.run.push(image);
        }
    })();

    PersonActions.updatePassiveReload = function (value) {
        localStorage.setItem('no_passive_reload', value);
        PersonActions.noPassiveReload = value;
        PersonActions.playGround.socket.send('noPassiveReload:' + (value ? '1' : '0'));
    };
    PersonActions.init = function () {
        var noPassivereload = localStorage.getItem('no_passive_reload');
        PersonActions.noPassiveReload = noPassivereload === 'true';
    };

    PersonActions.setDirection = function (direction) {
        PersonActions.playGround.socket.send("direction:" + direction);
    };
    PersonActions.doReload = function (e) {
        if (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
        }
        PersonActions.playGround.socket.send("reload");
    };
    PersonActions.startFire = function (e) {
        if (e) {
            e = e || window.event;
            e.preventDefault();
        }
        var playGround = PersonActions.playGround;
        if (!playGround.owner.id)return;
        if (this.playGround.chat.active) {
            this.playGround.chat.active = false;
            document.activeElement.blur();
        } else {
            var gun = '';
            var guns = playGround.owner.guns;
            for (var i = 0; i < guns.length; i++) {
                if (guns[i].indexOf(playGround.owner.gun + ":") === 0) {
                    gun = guns[i];
                    break;
                }
            }
            var data = gun.split(":");
            if (data[2] <= 0) {
                SoundUtils.play('sound/no-ammo.mp3');
            }
            //prevent reload stacking
            playGround.socket.send("fire:1");
        }
    };
    PersonActions.stopFire = function (e) {
        e = e || window.event;
        if (e) {
            e.preventDefault();
        }
        PersonActions.playGround.socket.send("fire:0");
    };
    PersonActions.onKeyDown = function (e) {
        var KeyboardSetup = Engine.require('KeyboardSetup');
        if (!PersonActions.playGround.gameStarted || this.playGround.chat.active || KeyboardSetup.isActive)return;
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
                PersonActions.buttonRight = true;
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
        if (thisEvent) {
            e.preventDefault();
            var direction = PersonActions.handleDirectionAfterButtons();
            PersonActions.setDirection(direction);
        }
    };
    PersonActions.handleDirectionAfterButtons = function () {
        if (PersonActions.buttonTop && !PersonActions.buttonBottom) {
            PersonActions.directionY = "north";
        } else if (!PersonActions.buttonTop && PersonActions.buttonBottom) {
            PersonActions.directionY = "south";
        } else {
            PersonActions.directionY = null;
        }

        if (PersonActions.buttonLeft && !PersonActions.buttonRight) {
            PersonActions.directionX = "west";
        } else if (!PersonActions.buttonLeft && PersonActions.buttonRight) {
            PersonActions.directionX = "east";
        } else {
            PersonActions.directionX = null;
        }
        if (PersonActions.directionY !== null) {
            if (PersonActions.directionX === null) {
                return PersonActions.directionY
            } else {
                return PersonActions.directionY + "_" + PersonActions.directionX;
            }
        } else if (PersonActions.directionX !== null) {
            return PersonActions.directionX;
        } else {
            return "none";
        }
    };
    PersonActions.stopMovement = function (e) {
        if (!PersonActions.playGround.gameStarted)return;
        var thisEvent = false;
        if (this.playGround.chat.active) {
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
        if (thisEvent) {
            var direction = PersonActions.handleDirectionAfterButtons();
            PersonActions.setDirection(direction);
        }
    };

    PersonActions.updateMouseDirectionByXy = function (x, y, person, offset) {
        var playGround = PersonActions.playGround;
        if (!playGround.gameStarted)return;
        var angle = Math.round(PersonActions.angle(
                    person.x,
                    person.y,
                    x - offset.left + window.scrollX,
                    y - offset.top + window.scrollY
                ) * 100) / 100;

        if (angle < 0) {
            angle = 360 + angle;
        }
        playGround.updatePersonViewAngle(angle);
    };

    PersonActions.updateMouseDirection = function (e) {
        var playGround = PersonActions.playGround;
        e = e || window.event;
        if ("undefined" === typeof e.clientX) {
            return;
        }
        playGround.xMouse = e.clientX;
        playGround.yMouse = e.clientY;
        var person = playGround.entities[playGround.owner ? playGround.owner.id : null];
        if (person) {
            PersonActions.updateMouseDirectionByXy(
                e.clientX,
                e.clientY,
                person,
                playGround.canvasOffset
            );
        }
    };
    PersonActions.angle = function (cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx);
        theta *= 180 / Math.PI;
        return theta;
    };
    PersonActions.drawPerson = function (person) {
        var playGround = PersonActions.playGround;
        person.draw(playGround);
    };

    PersonActions.mapPersonFromResponse = function (str, weaponInstance) {
        var playGround = PersonActions.playGround;
        var data = str.split(":");
        if(data[0] === 'f') {
            return PersonActions.mapPersonFromFullResponse(data)
        }
        var id = parseInt(data[0]);
        var p = playGround.entities[id];
        if(!p){
            //mapPersonFromFullResponse was not called
            return;
        }
        p.reload = parseInt(data[1]) === 1;
        p.gun = weaponInstance[data[2]].type;
        p.x = parseInt(data[3]);
        p.y = parseInt(data[4]);
        p.angle = parseFloat(data[5]);
        p.status = PersonActions.getStatus(parseInt(data[6]));


        if (playGround.owner.id == id) {
            PersonActions.updateMouseDirectionByXy(
                playGround.xMouse,
                playGround.yMouse,
                p,
                playGround.canvasOffset
            );
        }
        return p.id;
    };

    PersonActions.mapPersonFromFullResponse = function (data) {
        var playGround = PersonActions.playGround;
        var id = parseInt(data[1]);
        var name = decodeURIComponent(data[2]);
        if (!playGround.entities[id]) {
            playGround.addPerson(id);
            if (playGround.windowInactive && playGround.newPlayerInterval == null) {
                playGround.newPlayerInterval = (function (name) {
                    var nSwitch = false;
                    var title = window.document.getElementsByTagName('title')[0];
                    return setInterval(function () {
                        nSwitch = !nSwitch;
                        title.innerHTML = nSwitch ? '*** NEW PLAYER ***' : name;
                    }, 2000);
                })(name);
            }
        }
        var p = playGround.entities[id];
        p.name = name;
        p.reload = parseInt(data[3]) === 1;
        p.gun = Weapons.getInstance()[data[4]].type;
        p.x = parseInt(data[5]);
        p.y = parseInt(data[6]);
        p.angle = parseFloat(data[7]);
        p.score = parseInt(data[8]);
        p.team = data[9] ? parseInt(data[9]) : 0;
        p.opponentFlag = parseInt(data[10]) === 1;
        p.selfFlag = parseInt(data[11]) === 1;
        p.status = PersonActions.getStatus(parseInt(data[12]));


        if (playGround.owner.id == id) {
            PersonActions.updateMouseDirectionByXy(
                playGround.xMouse,
                playGround.yMouse,
                p,
                playGround.canvasOffset
            );
        }
        return p.id;
    };

    PersonActions.getStatus = function (key) {
        switch (key) {
            case 2:
                return 'shooted';
            case 3:
                return 'fried';
            case 4:
                return 'exploded';
            case 5:
                return 'cutted';
            case 6:
                return 'stats';
            default:
                return 'alive';
        }
    };
    PersonActions.reload = new Image();
    PersonActions.reload.src = 'images/map/reload.png';

    PersonActions.bulletRed = new Image();
    PersonActions.bulletRed.src = 'images/teams/bullet_red.png';
    PersonActions.bulletBlue = new Image();
    PersonActions.bulletBlue.src = 'images/teams/bullet_blue.png';
    PersonActions.flagRed = new Image();
    PersonActions.flagRed.src = 'images/teams/flag_red.png';
    PersonActions.flagBlue = new Image();
    PersonActions.flagBlue.src = 'images/teams/flag_blue.png';

    return PersonActions
}));