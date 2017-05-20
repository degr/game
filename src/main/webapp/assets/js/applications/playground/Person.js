Engine.define('Person', 'PersonActions', (function () {

    var PersonActions = Engine.require("PersonActions");
    var ZoneActions = Engine.require("ZoneActions");

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

    Person.prototype.draw = function(playGround) {

        var context = playGround.context;
        var person = this;
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

        if (playGround.owner && playGround.owner.id && playGround.owner.id == person.id) {
            if ((playGround.laserSight == 2 && person.gun != 'knife') || (playGround.laserSight == 1 && person.gun == 'sniper')) {
                context.moveTo(0, 0);
                context.strokeStyle = "rgba(0, 255, 24, 0.6)";
                context.lineTo(500, 0);
                context.stroke();
            }

            if (playGround.highlightOwner) {
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
            context.drawImage(PersonActions.reload, +playGround.radius + 4, -playGround.radius);
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

        if (playGround.drawBounds) {
            context.arc(0, 0, playGround.radius, 0, 2 * Math.PI, false);
        }

        context.stroke();
        var runIndex = person.runIndex || 0;
        if (runIndex >= PersonActions.run.length) {
            runIndex = 0;
        }
        var legRotate = Math.PI * 3 / 2;
        context.rotate(legRotate);
        context.drawImage(PersonActions.run[runIndex], -playGround.radius - 4 + halfRecoil, -playGround.radius + 5 + halfRecoil, 30, 30);
        context.rotate(-legRotate);
        context.drawImage(
            person.image,
            -playGround.radius - 8 + halfRecoil,
            -playGround.radius - 3 + halfRecoil,
            56,
            56
        );
        context.restore();
        if (person.prevX != person.x || person.prevY != person.y) {
            person.runIndex = runIndex + 1;
        }

        person.prevX = person.x;
        person.prevY = person.y;

        if (playGround.showNames) {
            context.textAlign = 'center';
            context.strokeText(person.name, x, y + 27);
        }
        if (person.onFire) {
            var flashXShift;
            var flashYShift;
            switch (person.gun) {
                case 'minigun':
                    flashXShift = playGround.radius + 5;
                    flashYShift = -13;
                    break;
                case 'sniper':
                case 'assault':
                    flashXShift = playGround.radius + 5;
                    flashYShift = -14;
                    break;
                case 'shotgun':
                    flashXShift = playGround.radius + 7;
                    flashYShift = -16;
                    break;
                case 'pistol':
                default:
                    flashXShift = playGround.radius;
                    flashYShift = -16;
            }

            var CGraphics = Engine.require('CGraphics');
            person.onFire = CGraphics.drawBulletFlash(person, flashXShift, flashYShift);
        }
    };

    return Person
}));