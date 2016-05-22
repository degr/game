var Weapons = {
    container: '',
    updater: {},
    weapons: {
        knife: {type: 'knife', code: 1, active: false, enable: true, max: 1, clip: 1, total: 0, current: 0},
        pistol: {type: 'pistol', code: 2, active: false, enable: true, max: 40, clip: 9, total: 0, current: 0},
        shotgun: {type: 'shotgun', code: 3, active: false, enable: false, max: 28, clip: 2, total: 0, current: 0},
        assault: {type: 'assault', code: 4,active: false, enable: false, max: 120, clip: 30, total: 0, current: 0},
        sniper: {type: 'sniper', code: 5, active: false, enable: false, max: 20, clip: 5, total: 0, current: 0},
        flamethrower: {type: 'flamethrower', code: 6,active: false, enable: false, max: 480, clip: 120, total: 0, current: 0},
        minigun: {type: 'minigun', code: 7,active: false, enable: false, max: 480, clip: 120, total: 0, current: 0},
        //grenade: {type: 'grenade', code: 8,active: false, enable: false, max: 4, clip: 1, total: 0, current: 0},
        rocket: {type: 'rocket', code: 8,active: false, enable: false, max: 5   , clip: 1, total: 0, current: 0}
    },
    init: function () {
        Weapons.container = Dom.el('div', {'class': 'weapon-holder'});
        for (var i in Weapons.weapons) {
            Weapons.buildWeapon(Weapons.weapons[i]);
        }
    },
    update: function(owner) {
        if(!owner)return;
        var weapons = Weapons.mapResponse(owner.guns, owner.gun);
        for(var i in weapons) {
            var weapon = weapons[i];
            Weapons.updater[weapon.type](weapon);
        }
    },
    mapResponse: function (guns, active) {
        var out = {};
        for(var i = 0; i < guns.length; i++) {
            var proto = guns[i].split(':');
            out[proto[0]] = {type: proto[0], total: proto[1], current: proto[2], enable: true};
        }
        for(var j in Weapons.weapons) {
            var inList = Weapons.weapons[j];
            if(!out[j]) {
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
        var onUpdateCallback = function(weapon) {
            amount.innerHTML = weapon.total + "/" + weapon.max;
            var percents = weapon.current * 100 / weapon.clip;
            now.setAttribute('style', 'width:' + percents + '%');
            now.innerHTML = weapon.current;
            out.className = "weapon " + (weapon.enable ? "enable " : "disable ") + (weapon.active ? 'active' : '');
        };
        onUpdateCallback(weapon);
        Weapons.updater[weapon.type] = onUpdateCallback;
        Weapons.container.appendChild(out);
    },
    changeWeapon: function(e) {
        if(!PlayGround.gameStarted)return;
        e = e || window.event;
        var code = e.keyCode;
        var thisEvent = false;
        var gun = '';
        var guns = PlayGround.owner.guns;
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
                gun = Weapons.findWeapon(true);
                break;
            case Controls.previousWeapon:
                thisEvent = true;
                gun = Weapons.findWeapon(false);
                break;
        }
        if(thisEvent) {
            e.preventDefault();
            var gunCode = Weapons.weapons[gun].code;
            gun += ":";
            for(var i = 0; i < guns.length; i++) {
                var item = guns[i];
                if(item.indexOf(gun) === 0) {
                    Weapons.setWeapon(gunCode);
                    break;
                }
            }
        }
    },
    findWeapon: function(isNext) {
        var gun = PlayGround.owner.gun + ":";
        var guns = PlayGround.owner.guns;
        var gunIndex = -1;
        for(var i = 0; i < guns.length; i++) {
            if(guns[i].indexOf(gun) === 0) {
                gunIndex = i;
            }
        }
        if(isNext) {
            gunIndex = gunIndex == guns.length -1 ? 0 : gunIndex + 1;
        } else {
            gunIndex = gunIndex == 0 ? guns.length - 1 : gunIndex - 1;
        }
        return PlayGround.owner.guns[gunIndex].split(':')[0];
    },
    setWeapon: function(gun) {
        PlayGround.socket.send("gun:" + gun);
    }
};