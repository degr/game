Engine.define('WeaponControl', ['Dom', 'Weapons', 'ObjectUtils'], (function(){
    var Dom = Engine.require('Dom');
    var Weapons = Engine.require('Weapons');
    var ObjectUtils = Engine.require('ObjectUtils');

    var WeaponControl = function(onChange) {
        this.container = Dom.el('div', {'class': 'weapon-holder'});
        this.weapons = Weapons.getInstance();
        this.controls = {};

        var me = this;
        /*this.container.addEventListener('mouseover', function () {
            if (me.rightSide) {
                Dom.addClass(me.container, 'w-left');
            } else {
                Dom.removeClass(me.container, 'w-left');
            }
            me.rightSide = !me.rightSide;
        }, false);*/

        for (var i in this.weapons) {
            if(this.weapons.hasOwnProperty(i)) {
                var control = this.buildWeapon(this.weapons[i], onChange);
                this.controls[i] = control;
                control.setAmmo(this.weapons[i]);
                control.setStatuses(false, false);
            }
        }
    };
    WeaponControl.prototype.update = function (owner, person) {
        if (!owner)return;
        var weapons = this.mapResponse(owner.guns);
        var isAlive = person && person.status === 'alive';
        for(var k in this.controls) {
            if(this.controls.hasOwnProperty(k)) {
                var control = this.controls[k];
                if (weapons[k] && isAlive) {
                    control.setAmmo(weapons[k]);
                    control.setStatuses(true, owner.gun === k);
                } else {
                    control.setAmmo(control.weapon);
                    control.setStatuses(
                        !isAlive,
                        owner.gun === k
                    )
                }
            }
        }

    };
    WeaponControl.prototype.mapResponse = function (guns) {
        var out = {};
        if (!guns)return out;
        var weapons = this.weapons;
        for (var i = 0; i < guns.length; i++) {
            var data = guns[i];
            if (data) {
                var proto = guns[i].split(':');
                out[proto[0]] = {
                    code: proto[0],
                    total: proto[1],
                    current: proto[2],
                    enable: true
                };
            }
        }

        for (var j in weapons) {
            if (!weapons.hasOwnProperty(j))continue;
            var defaultWeapon = weapons[j];
            if (out[j]) {
                out[j].clip = defaultWeapon.clip;
                out[j].max = defaultWeapon.max;
            }
        }
        return out;
    };

    WeaponControl.prototype.buildWeapon = function (weapon, onChange) {
        var out = document.createElement("div");
        var amount = document.createElement("div");
        var ammoholder = document.createElement("div");
        out.appendChild(weapon.image);
        out.appendChild(amount);
        out.appendChild(ammoholder);
        out.className = "weapon";
        ammoholder.className = "ammoholder";
        var now = document.createElement("div");
        ammoholder.appendChild(now);
        now.className = "now";
        Dom.addListeners(out, {click: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.preventBubble = true;
            onChange(weapon.code);
        }});
        this.container.appendChild(out);
        return {
            el: out,
            weapon: weapon,
            setStatuses: function(isEnabled, isActive){
                out.className = "weapon " + (isEnabled ? "enable " : "disable ") + (isActive ? 'active' : '');
            },
            setAmmo: function(weapon) {
                amount.innerHTML = weapon.total + "/" + weapon.max;
                var percents = weapon.current * 100 / weapon.clip;
                now.style.width = percents + '%';
                now.innerHTML = weapon.current;
            }
        }
    };

    return WeaponControl;
}));