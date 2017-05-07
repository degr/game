Engine.define('WeaponActions', ['Dom', 'Controls', 'Weapons'], (function () {

    var Dom = Engine.require('Dom');
    var Controls = Engine.require('Controls');
    var Weapons = Engine.require('Weapons');
    
    var WeaponActions = {
        /**
         * @var PlayGround
         */
        playGround: null,
        weapons: Weapons.getInstance(),
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
                var gunCode = -1;
                for(var key in WeaponActions.weapons) {
                    var w = WeaponActions.weapons[key];
                    if(w.type === gun) {
                        gunCode = w.code;
                    }
                }
                gun = gunCode + ":";
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
}));