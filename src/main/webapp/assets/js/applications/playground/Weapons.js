Engine.define('Weapons', (function () {
    
    function getImage(src) {
        var out = new Image();
        out.src = 'images/map/' + src + '.png';
        return out;
    }
    
    var data = {
        1: {
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
        2: {
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
        3: {
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
        4: {
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
        5: {
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
        6: {
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
        7: {
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
        8: {
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
        getInstance: function(withoutImage) {
            var out = {};
            for(var weapon in data) {
                if(data.hasOwnProperty(weapon)) {
                    var item = {};
                    var proto = data[weapon];
                    for (var key in proto) {
                        if (!proto.hasOwnProperty(key))continue;
                        if (key === 'image') {
                            if(!withoutImage) {
                                item.image = proto.image.cloneNode(true);
                            }
                        } else {
                            item[key] = proto[key];
                        }
                    }
                    out[weapon] = item;
                }
            }
            return out;
        }
    };
}));