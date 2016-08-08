Engine.define('WeaponActions', (function () {

    var Dom = Engine.require('Dom');
    var Controls = Engine.require('Controls');
    var Weapons = Engine.require('Weapons');
    
    var WeaponActions = {
        container: '',
        rightSide: true,
        updater: {},
        /**
         * @var PlayGround
         */
        playGround: null,
        weapons: Weapons.getInstance(),
        init: function () {
            WeaponActions.container = Dom.el('div', {'class': 'weapon-holder'});
            WeaponActions.container.addEventListener('mouseover', function () {
                if (WeaponActions.rightSide) {
                    Dom.addClass(WeaponActions.container, 'left');
                } else {
                    Dom.removeClass(WeaponActions.container, 'left');
                }
                WeaponActions.rightSide = !WeaponActions.rightSide;
            }, false);
            for (var i in WeaponActions.weapons) {
                if(WeaponActions.weapons.hasOwnProperty(i)) {
                    WeaponActions.buildWeapon(WeaponActions.weapons[i]);
                }
            }
        },
        update: function (owner) {
            if (!owner)return;
            var weapons = WeaponActions.mapResponse(owner.guns, owner.gun);
            for (var i in weapons) {
                if(!weapons.hasOwnProperty(i))continue;
                var weapon = weapons[i];
                WeaponActions.updater[weapon.type](weapon);
            }
        },
        mapResponse: function (guns, active) {
            if (!guns)return;
            var out = {};
            for (var i = 0; i < guns.length; i++) {
                var proto = guns[i].split(':');
                out[proto[0]] = {type: proto[0], total: proto[1], current: proto[2], enable: true};
            }
            var weapons = WeaponActions.weapons;
            for (var j in weapons) {
                if(!weapons.hasOwnProperty(j))continue;
                var inList = weapons[j];
                if (!out[j]) {
                    out[j] = inList;
                } else {
                    out[j].clip = inList.clip;
                    out[j].max = inList.max;
                }
            }
            out[active].active = true;
            return out;
        },
        buildWeapon: function (weapon) {
            var out = document.createElement("div");
            var amount = document.createElement("div");
            var ammoholder = document.createElement("div");
            out.appendChild(Dom.el('div', null, weapon.type));
            out.appendChild(amount);
            out.appendChild(ammoholder);
            ammoholder.className = "ammoholder";
            var now = document.createElement("div");
            ammoholder.appendChild(now);
            now.className = "now";
            var onUpdateCallback = function (weapon) {
                amount.innerHTML = weapon.total + "/" + weapon.max;
                var percents = weapon.current * 100 / weapon.clip;
                now.setAttribute('style', 'width:' + percents + '%');
                now.innerHTML = weapon.current;
                out.className = "weapon " + (weapon.enable ? "enable " : "disable ") + (weapon.active ? 'active' : '');
            };
            onUpdateCallback(weapon);
            WeaponActions.updater[weapon.type] = onUpdateCallback;
            WeaponActions.container.appendChild(out);
        },
        changeWeapon: function (e) {
            var playGround = WeaponActions.playGround;
            var KeyboardSetup = Engine.require('KeyboardSetup');
            if (!playGround.gameStarted || playGround.chat.active || KeyboardSetup.isActive)return;
            e = e || window.event;
            var code = e.keyCode;
            var thisEvent = false;
            var gun = '';
            var guns = playGround.owner.guns;
            switch (code) {
                case Controls.knife:
                    gun = 'knife';
                    thisEvent = true;
                    break;
                case Controls.pistol:
                    gun = 'pistol';
                    thisEvent = true;
                    break;
                case Controls.shotgun:
                    gun = 'shotgun';
                    thisEvent = true;
                    break;
                case Controls.assault:
                    gun = 'assault';
                    thisEvent = true;
                    break;
                case Controls.sniper:
                    gun = 'sniper';
                    thisEvent = true;
                    break;
                case Controls.flamethrower:
                    gun = 'flamethrower';
                    thisEvent = true;
                    break;
                case Controls.minigun:
                    gun = 'minigun';
                    thisEvent = true;
                    break;
                case Controls.rocket:
                    gun = 'rocket';
                    thisEvent = true;
                    break;
                case Controls.nextWeapon:
                    thisEvent = true;
                    gun = WeaponActions.findWeapon(true);
                    break;
                case Controls.previousWeapon:
                    thisEvent = true;
                    gun = WeaponActions.findWeapon(false);
                    break;
            }
            if (thisEvent) {
                e.preventDefault();
                var gunCode = WeaponActions.weapons[gun].code;
                gun += ":";
                for (var i = 0; i < guns.length; i++) {
                    var item = guns[i];
                    if (item.indexOf(gun) === 0) {
                        WeaponActions.setWeapon(gunCode);
                        break;
                    }
                }
            }
        },
        findWeapon: function (isNext) {
            var sorted = [];
            var playGround = WeaponActions.playGround;
            var guns = playGround.owner.guns;
            var gun = playGround.owner.gun;
            var currentIndex = -1;
            var idx = 0;
            var weapons = WeaponActions.weapons;
            for (var weaponId in weapons) {
                if(!weapons.hasOwnProperty(weaponId))continue;
                var weapon = weapons[weaponId];
                for (var i = 0; i < guns.length; i++) {
                    var iGun = guns[i];
                    if (iGun.indexOf(weapon.type + ':') === 0) {
                        sorted.push(weaponId);
                        if (weaponId == gun) {
                            currentIndex = idx;
                        }
                        idx++;
                        break;
                    }
                }
            }
            var index = isNext ? currentIndex + 1 : currentIndex - 1;
            if (index < 0) {
                index = sorted.length - 1;
            } else if (index >= sorted.length) {
                index = 0;
            }
            return sorted[index];
        },
        setWeapon: function (gun) {
            WeaponActions.playGround.socket.send("gun:" + gun);
        }
    };
    return WeaponActions
})());