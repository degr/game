var PlayGround = {
    container: null,
    init: function() {
        var weapons = PlayGround.buildWeapons();
        var map = Dom.el('canvas', {width: 640, height: 480, id:'playground'});
        PlayGround.container = Dom.el('div', {'class': 'playground'}, [weapons, map]);
    },
    buildWeapons: function () {
        return Dom.el('div');
    }
}