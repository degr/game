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
        var el = document.createElement("div");
        var amount = document.createElement("div");
        var ammoholder = document.createElement("div");
        el.appendChild(weapon.image);
        el.appendChild(amount);
        el.appendChild(ammoholder);
        el.className = "weapon";
        ammoholder.className = "ammoholder";
        var now = document.createElement("div");
        ammoholder.appendChild(now);
        now.className = "now";
        var handlers = {click: function(e){
            e.preventDefault();
            onChange(weapon.code);
        }, onmousedown: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.preventBubble = true;
        }};
        Dom.addListeners(el, handlers);
        /*Dom.addListeners(weapon.image, handlers);
        Dom.addListeners(amount, handlers);
        Dom.addListeners(ammoholder, handlers);
        Dom.addListeners(now, handlers);*/
        this.container.appendChild(el);
        var out = {
            el: el,
            weapon: weapon,
            statuses: {
                isEnabled: null,
                isActive: null
            },
            setStatuses: function(isEnabled, isActive){
                if(out.statuses.isEnabled !== isEnabled || out.statuses.isActive !== isActive) {
                    out.statuses.isEnabled = isEnabled;
                    out.statuses.isActive = isActive;
                    el.className = "weapon " + (isEnabled ? "enable " : "disable ") + (isActive ? 'active' : '');
                }
            },
            ammo: {
                total: -1,
                max: -1,
                current: -1,
                clip: -1
            },
            setAmmo: function(weapon) {
                var ammo = out.ammo;
                if(ammo.current !== weapon.current || ammo.total !== weapon.total || ammo.max !== weapon.max || ammo.clip !== weapon.clip) {
                    amount.innerHTML = weapon.total + "/" + weapon.max;
                    var percents = weapon.current * 100 / weapon.clip;
                    now.style.width = percents + '%';
                    now.innerHTML = weapon.current;

                    ammo.current = weapon.current;
                    ammo.total = weapon.total;
                    ammo.max = weapon.max;
                    ammo.clip = weapon.clip;
                }
            }
        };
        return out;
    };

    return WeaponControl;
}));