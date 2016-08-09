Engine.define('WeaponControl', (function(){
    var Dom = Engine.require('Dom');
    var Weapons = Engine.require('Weapons');

    var WeaponControl = function() {
        this.container = Dom.el('div', {'class': 'weapon-holder'});
        this.weapons = Weapons.getInstance();
        this.updater = {};

        var me = this;
        this.container.addEventListener('mouseover', function () {
            if (me.rightSide) {
                Dom.addClass(me.container, 'left');
            } else {
                Dom.removeClass(me.container, 'left');
            }
            me.rightSide = !me.rightSide;
        }, false);

        for (var i in this.weapons) {
            if(this.weapons.hasOwnProperty(i)) {
                this.buildWeapon(this.weapons[i]);
            }
        }
    };
    WeaponControl.prototype.update = function (owner) {
        if (!owner)return;
        var weapons = this.mapResponse(owner.guns, owner.gun);
        for (var i in weapons) {
            if(!weapons.hasOwnProperty(i))continue;
            var weapon = weapons[i];
            this.updater[weapon.type](weapon);
        }
    };
    WeaponControl.prototype.mapResponse = function (guns, active) {
        if (!guns)return;
        var out = {};
        for (var i = 0; i < guns.length; i++) {
            var proto = guns[i].split(':');
            out[proto[0]] = {type: proto[0], total: proto[1], current: proto[2], enable: true};
        }
        var weapons = this.weapons;
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
    };

    WeaponControl.prototype.buildWeapon = function (weapon) {
        var out = document.createElement("div");
        var amount = document.createElement("div");
        var ammoholder = document.createElement("div");
        out.appendChild(weapon.image);
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
        var me = this;
        this.updater[weapon.type] = onUpdateCallback
        this.container.appendChild(out);
    };

    return WeaponControl;
})());