Engine.define('PersonActions', (function () {

    var SoundUtils = Engine.require('SoundUtils');
    var ZoneActions = Engine.require('ZoneActions');
    var Chat = Engine.require('Chat');
    var Controls = Engine.require('Controls');

    var PersonActions = {
        buttonTop: false,
        buttonBottom: false,
        buttonLeft: false,
        buttonRight: false,
        directionX: null,
        directionY: null,
        noPassiveReload: false
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

        var PlayGround = Engine.require('PlayGround');
        localStorage.setItem('no_passive_reload', value);
        PersonActions.noPassiveReload = value;
        PlayGround.socket.send('noPassiveReload:' + (value ? '1' : '0'));
    };
    PersonActions.init = function () {
        var noPassivereload = localStorage.getItem('no_passive_reload');
        PersonActions.noPassiveReload = noPassivereload === 'true';
    };

    PersonActions.setDirection = function (direction) {

        var PlayGround = Engine.require('PlayGround');
        PlayGround.socket.send("direction:" + direction);
    };
    PersonActions.doReload = function (e) {

        var PlayGround = Engine.require('PlayGround');
        if (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
        }
        PlayGround.socket.send("reload");
    };
    PersonActions.startFire = function (e) {
        if (e) {
            e = e || window.event;
            e.preventDefault();
        }
        var PlayGround = Engine.require('PlayGround');
        if (!PlayGround.owner.id)return;
        if (Chat.active) {
            Chat.active = false;
            document.activeElement.blur();
        } else {
            var gun = '';
            var guns = PlayGround.owner.guns;
            for (var i = 0; i < guns.length; i++) {
                if (guns[i].indexOf(PlayGround.owner.gun + ":") === 0) {
                    gun = guns[i];
                    break;
                }
            }
            var data = gun.split(":");
            if (data[2] <= 0) {
                SoundUtils.play('sound/no-ammo.mp3');
            }
            //prevent reload stacking
            PlayGround.socket.send("fire:1");
        }
    };
    PersonActions.stopFire = function (e) {
        var PlayGround = Engine.require('PlayGround');
        if (e) {
            e = e || window.event;
            e.preventDefault();
        }
        PlayGround.socket.send("fire:0");
    };
    PersonActions.onKeyDown = function (e) {
        var PlayGround = Engine.require('PlayGround');
        var KeyboardSetup = Engine.require('KeyboardSetup');
        if (!PlayGround.gameStarted || Chat.active || KeyboardSetup.isActive)return;
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
        var PlayGround = Engine.require('PlayGround');
        if (!PlayGround.gameStarted)return;
        var thisEvent = false;
        if (Chat.active) {
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
        var PlayGround = Engine.require('PlayGround');
        if (!PlayGround.gameStarted)return;
        var angle = Math.floor(PersonActions.angle(
                    person.x,
                    person.y,
                    x - offset.left + window.scrollX,
                    y - offset.top + window.scrollY
                ) * 10) / 10;

        if (angle < 0) {
            angle = 360 + angle;
        }
        PlayGround.updatePersonViewAngle(angle);
    };

    PersonActions.updateMouseDirection = function (e) {
        var PlayGround = Engine.require('PlayGround');
        e = e || window.event;
        if ("undefined" == typeof e.clientX) {
            return;
        }
        PlayGround.xMouse = e.clientX;
        PlayGround.yMouse = e.clientY;
        var person = PlayGround.entities[PlayGround.owner ? PlayGround.owner.id : null];
        if (person) {
            PersonActions.updateMouseDirectionByXy(
                e.clientX,
                e.clientY,
                person,
                PlayGround.canvasOffset
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
        var PlayGround = Engine.require('PlayGround');
        var context = PlayGround.context;
        var x = person.x;
        var y = person.y;
        var angle = person.angle + 90;
        if (person.team > 0) {
            var image = person.team == 1 ? PersonActions.bulletRed : PersonActions.bulletBlue;
            context.drawImage(image, person.x - 25, person.y - 25, 8, 8);
        }
        context.save();
        context.beginPath();
        context.translate(x, y);
        context.rotate((angle - 90) * Math.PI / 180);
        var recoil = person.recoil || 0;
        var halfRecoil;
        if (recoil > 0) {
            if (person.recoilSide == null) {
                person.recoilSide = Math.random() > 0.5 ? 1 : -1;
            }
            recoil = recoil * person.recoilSide;
            halfRecoil = recoil / 2;
        } else {
            if (person.recoilSide != null) {
                person.recoilSide = null;
            }
            halfRecoil = 0;
        }
        if (recoil > -0.5 && recoil < 0.5) {
            person.recoil = 0;
            person.recoilSide = null;
        } else {
            person.recoil = person.recoil - 0.5;
        }

        if (PlayGround.owner && PlayGround.owner.id && PlayGround.owner.id == person.id) {
            if ((PlayGround.laserSight == 2 && person.gun != 'knife') || (PlayGround.laserSight == 1 && person.gun == 'sniper')) {
                context.moveTo(0, 0);
                context.strokeStyle = "rgba(0, 255, 24, 0.6)";
                context.lineTo(500, 0);
                context.stroke();
            }

            if (PlayGround.highlightOwner) {
                var grdSize = 20;
                var grd = context.createRadialGradient(0, 0, 3, 0, 0, grdSize);
                grd.addColorStop(0, "#FEFF22");
                grd.addColorStop(1, "transparent");
                context.fillStyle = grd;
                context.fillRect(-grdSize, -grdSize, grdSize * 2, grdSize * 2);
            }
        }
        switch (person.gun) {
            case 'knife':
                var knifeAngle = 0;
                var knifeShift = 0;
                if (person.knifeLifeCycle > 0) {
                    if (person.isPiercingKnife) {
                        knifeShift = person.knifeShift;
                        if (person.knifeLifeCycle < 5) {
                            knifeShift = person.knifeShift;
                            person.knifeShift += 3;
                        } else {
                            person.knifeShift -= 3;
                        }
                    } else {
                        knifeAngle = (person.knifeAngle - 4) * 12 - 40;
                        context.rotate(knifeAngle * Math.PI / 180);
                        person.knifeAngle++;
                        if (person.knifeAngle > 12) {
                            person.knifeAngle = 0
                        }
                    }
                    if (person.knifeLifeCycle > 10) {
                        person.knifeLifeCycle = 0
                    } else {
                        person.knifeLifeCycle++;
                    }
                }
                context.drawImage(ZoneActions.images.knife, -6 + knifeShift, -14, 32, 32);
                if (knifeAngle != 0) {
                    context.rotate(-knifeAngle * Math.PI / 180);
                }
                break;
            case 'pistol':
                context.drawImage(ZoneActions.images.pistol, -10 + recoil, -14 + recoil);
                break;
            default:
                context.drawImage(ZoneActions.images[person.gun], -6 + recoil, -14 + recoil, 32, 32)
        }
        context.restore();

        context.save();
        context.beginPath();
        context.strokeStyle = person.hexColor;
        context.translate(x, y);
        if (person.reload) {
            context.drawImage(PersonActions.reload, +PlayGround.radius + 4, -PlayGround.radius);
        }
        var rotated = false;
        if (person.team > 0) {
            var flagSize = 20;
            var flagShiftY = -35;
            var rotateAngle = 135;
            if (person.opponentFlag) {
                context.rotate((angle + rotateAngle) * Math.PI / 180);
                rotated = true;
                var opponentFlag = person.team == 1 ? PersonActions.flagBlue : PersonActions.flagRed;
                context.drawImage(opponentFlag, 0, flagShiftY, flagSize, flagSize)
            }
            if (person.selfFlag) {
                if (!rotated) {
                    rotated = true;
                    context.rotate((angle + rotateAngle) * Math.PI / 180);
                }
                var selfFlag = person.team == 2 ? PersonActions.flagBlue : PersonActions.flagRed;
                context.drawImage(selfFlag, 14, flagShiftY + 10, flagSize, flagSize)
            }
            if (rotated) {
                context.rotate((-rotateAngle) * Math.PI / 180);
            }
        }
        if (!rotated) {
            context.rotate(angle * Math.PI / 180);
        }

        if (PlayGround.drawBounds) {
            context.arc(0, 0, PlayGround.radius, 0, 2 * Math.PI, false);
        }

        context.stroke();
        var runIndex = person.runIndex || 0;
        if (runIndex >= PersonActions.run.length) {
            runIndex = 0;
        }
        var legRotate = Math.PI * 3 / 2;
        context.rotate(legRotate);
        context.drawImage(PersonActions.run[runIndex], -PlayGround.radius - 4 + halfRecoil, -PlayGround.radius + 5 + halfRecoil, 30, 30);
        context.rotate(-legRotate);
        context.drawImage(person.image, -PlayGround.radius - 8 + halfRecoil, -PlayGround.radius - 3 + halfRecoil, 56, 56);
        context.restore();
        if (person.prevX != person.x || person.prevY != person.y) {
            person.runIndex = runIndex + 1;
        }

        person.prevX = person.x;
        person.prevY = person.y;

        if (PlayGround.showNames) {
            context.textAlign = 'center';
            context.strokeText(person.name, x, y + 27);
        }
        if (person.onFire) {
            var flashXShift;
            var flashYShift;
            switch (person.gun) {
                case 'minigun':
                    flashXShift = PlayGround.radius + 5;
                    flashYShift = -13;
                    break;
                case 'sniper':
                case 'assault':
                    flashXShift = PlayGround.radius + 5;
                    flashYShift = -14;
                    break;
                case 'shotgun':
                    flashXShift = PlayGround.radius + 7;
                    flashYShift = -16;
                    break;
                case 'pistol':
                default:
                    flashXShift = PlayGround.radius;
                    flashYShift = -16;
            }

            var CGraphics = Engine.require('CGraphics');
            person.onFire = CGraphics.drawBulletFlash(person, flashXShift, flashYShift);
        }
    };

    PersonActions.mapPersonFromResponse = function (str) {
        var PlayGround = Engine.require('PlayGround');
        var data = str.split(":");
        var id = parseInt(data[0]);
        var name = decodeURIComponent(data[1]);
        if (!PlayGround.entities[id]) {
            PlayGround.addPerson(id);
            if (PlayGround.windowInactive && PlayGround.newPlayerInterval == null) {
                PlayGround.newPlayerInterval = (function (name) {
                    var nSwitch = false;
                    var title = window.document.getElementsByTagName('title')[0];
                    return setInterval(function () {
                        nSwitch = !nSwitch;
                        title.innerHTML = nSwitch ? '*** NEW PLAYER ***' : name;
                    }, 2000);
                })(name);
            }
        }
        var p = PlayGround.entities[id];
        p.name = name;
        p.reload = data[2] == 1;
        p.gun = data[3];
        p.x = parseInt(data[4]);
        p.y = parseInt(data[5]);
        p.angle = parseFloat(data[6]);
        p.score = parseInt(data[7]);
        p.team = data[8] ? parseInt(data[8]) : 0;
        p.opponentFlag = parseInt(data[9]) == 1;
        p.selfFlag = parseInt(data[10]) == 1;
        p.status = PersonActions.getStatus(parseInt(data[11]));


        if (PlayGround.owner.id == id) {
            PersonActions.updateMouseDirectionByXy(
                PlayGround.xMouse,
                PlayGround.yMouse,
                p,
                PlayGround.canvasOffset
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
    PersonActions.personOld = new Image();
    PersonActions.personOld.src = 'images/soldier1.png';
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
})());