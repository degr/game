var Weapons = {
    container: '',
    updater: {},
    weapons: {
        knife: {type: 'knife', active: false, enable: true, max: 1, clip: 1, total: 0, current: 0},
        pistol: {type: 'pistol',active: false, enable: true, max: 40, clip: 9, total: 0, current: 0},
        shotgun: {type: 'shotgun',active: false, enable: false, max: 28, clip: 7, total: 0, current: 0},
        assault: {type: 'assault',active: false, enable: false, max: 120, clip: 30, total: 0, current: 0},
        sniper: {type: 'sniper',active: false, enable: false, max: 20, clip: 5, total: 0, current: 0},
        minigun: {type: 'minigun',active: false, enable: false, max: 480, clip: 120, total: 0, current: 0},
        flame: {type: 'flame',active: false, enable: false, max: 120, clip: 30, total: 0, current: 0},
        grenade: {type: 'grenade',active: false, enable: false, max: 4, clip: 1, total: 0, current: 0},
        rocket: {type: 'rocket',active: false, enable: false, max: 5   , clip: 1, total: 0, current: 0}
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
            amount.innerHTML = weapon.max + "/" +weapon.total;
            var percents = weapon.current * 100 / weapon.clip;
            now.setAttribute('style', 'width:' + percents + '%');
            now.innerHTML = weapon.current;
            out.className = "weapon " + (weapon.enable ? "enable " : "disable ") + (weapon.active ? 'active' : '');
        };
        onUpdateCallback(weapon);
        Weapons.updater[weapon.type] = onUpdateCallback;
        Weapons.container.appendChild(out);
    }
};