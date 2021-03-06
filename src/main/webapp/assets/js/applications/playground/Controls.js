Engine.define('Controls', function () {
    var Controls = {
        left: 65,
        top: 87,
        right: 68,
        bottom: 83,
        nextWeapon: 0,
        previousWeapon: null,
        reload: null,
        knife: 49,
        pistol: 50,
        shotgun: 51,
        assault: 52,
        sniper: 53,
        flamethrower: 54,
        minigun: 55,
        rocket: 56,
        score: 9,
        bind1: null,
        bind2: null,
        bind3: null,
        bind4: null,
        bind5: null,
        bind6: null,
        bind7: null,
        bind8: null,
        bind9: null,
        //grenage: 9
        chat: 13
    };
    
    var oldConfig = localStorage.getItem('keyboard');
    if (oldConfig) {
        try {
            var obj = JSON.parse(oldConfig);
            if (obj) {
                for (var k in obj) {
                    if(obj.hasOwnProperty(k)) {
                        Controls[k] = obj[k];
                    }
                }
            }
        } catch (e) {
            console.log('something wrong with keyboard config');
            localStorage.removeItem('keyboard');
        }
    }
    
    
    return Controls;
});