Engine.define('Weapons', (function () {
    
    function getImage(src) {
        var out = new Image();
        out.src = 'images/map/' + src + '.png';
        return out;
    }
    
    var data = {
        knife: {
            type: 'knife',
            code: 1,
            active: false,
            enable: true,
            max: 1,
            clip: 1,
            total: 0,
            current: 0,
            image: getImage('knife')
        },
        pistol: {
            type: 'pistol',
            code: 2,
            active: false,
            enable: true,
            max: 40,
            clip: 9,
            total: 0,
            current: 0,
            image: getImage('pistol')
        },
        shotgun: {
            type: 'shotgun',
            code: 3,
            active: false,
            enable: false,
            max: 28,
            clip: 2,
            total: 0,
            current: 0,
            image: getImage('shotgun')
        },
        assault: {
            type: 'assault',
            code: 4,
            active: false,
            enable: false,
            max: 120,
            clip: 30,
            total: 0,
            current: 0,
            image: getImage('assault')
        },
        sniper: {
            type: 'sniper',
            code: 5,
            active: false,
            enable: false,
            max: 20,
            clip: 5,
            total: 0,
            current: 0,
            image: getImage('sniper')
        },
        flamethrower: {
            type: 'flamethrower',
            code: 6,
            active: false,
            enable: false,
            max: 480,
            clip: 120,
            total: 0,
            current: 0,
            image: getImage('flame')
        },
        minigun: {
            type: 'minigun',
            code: 7,
            active: false,
            enable: false,
            max: 480,
            clip: 120,
            total: 0,
            current: 0,
            image: getImage('minigun')
        },
        //grenade: {type: 'grenade', code: 8,active: false, enable: false, max: 4, clip: 1, total: 0, current: 0},
        rocket: {
            type: 'rocket',
            code: 8,
            active: false,
            enable: false,
            max: 5,
            clip: 1,
            total: 0,
            current: 0,
            image: getImage('rocket')
        }
    };
    return {
        getInstance: function() {
            var out = {};
            for(var weapon in data) {
                if(!data.hasOwnProperty(weapon))continue;
                var item = {};
                var proto = data[weapon];
                for(var key in proto) {
                    if(!proto.hasOwnProperty(key))continue;
                    if(key === 'image') {
                        item.image = proto.image.cloneNode(true);
                    } else {
                        item[key] = proto[key];
                    }
                }
                out[weapon] = item;
            }
            return out;
        }
    };
})());