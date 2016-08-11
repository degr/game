Engine.define('CustomTiles', (function () {
    
    var Dom = Engine.require('Dom');
    var Rest = Engine.require('Rest');
    var DomComponents = Engine.require('DomComponents');
    
    var CustomTiles = function (loadObjects) {
        this.container = null;
        this.isOnSubmit = false;
        this.loadObjects = loadObjects;
        var me = this;
        var title = Dom.el('h3', null, 'Create custom tile');
        var fileupload = Dom.el('input', {type: 'file', name: 'fileupload', id: 'tile_fileupload'});
        var labelFileupload = Dom.el('label', {for: 'tile_fileupload'}, 'Tile image');
        var tileTitle = Dom.el('input', {type: 'text', id: 'tile_title', name: 'title'});
        var labelTileTitle = Dom.el('label', {for: 'tile_title'}, 'Tile title');
        var x = Dom.el('input', {type: 'text', id: 'tile_x', name: 'width', value: 40});
        var labelX = Dom.el('label', {for: 'tile_x'}, 'Tile width');
        var y = Dom.el('input', {type: 'text', id: 'tile_y', name: 'height', value: 40});
        var tileSet = Dom.el('input', {type: 'checkbox', id: 'is_tileset', name: 'is_tileset'});
        var tileSetLabel = Dom.el('label', {'for': 'is_tileset'}, [tileSet, 'Is tile set (pack of same sized images)']);
        var labelY = Dom.el('label', {for: 'tile_y'}, 'Tile height');
        var submit = Dom.el('input', {type: 'submit', value: 'Create tile'});
        var target = Dom.el('iframe', {id: 'custom_tile_iframe', name: 'custom_tile_iframe'});
        var hide = Dom.el('input', {type: 'button', value: 'Close'});
        hide.onclick = function () {
            me.hide();
        };
        target.onload = function () {
            if (me.isOnSubmit) {
                me.isOnSubmit = false;
                var contents = target.contentDocument || target.contentWindow.document;
                var body = contents.body;
                if (body && body.innerText == 'true') {
                    me.loadObjects();
                    me.hide()
                } else {
                    alert("Can't save tile. Possible width and height is undefined, or file is not a valid image. Please upload only JPG, PNG, GIF and JPEG");
                }
            }
        };
        this.container = Dom.el(
            'form',
            {
                method: 'post',
                enctype: 'multipart/form-data',
                'class': 'panel hidden',
                onsubmit: function(){this.action = Rest.host + 'zones/create-zone'},
                target: 'custom_tile_iframe'
            },
            [
                title,
                labelTileTitle, tileTitle, Dom.el('br'),
                labelFileupload, fileupload, Dom.el('br'),
                labelX, x, Dom.el('br'),
                labelY, y, Dom.el('br'),
                tileSetLabel, Dom.el('br'),
                submit, hide, target
            ]
        );
        DomComponents.doModal(this.container);
        this.container.onsubmit = function () {
            me.isOnSubmit = true;
        }
    };
    
    CustomTiles.prototype.show = function () {
        Dom.removeClass(this.container, 'hidden');
    };

    CustomTiles.prototype.hide = function () {
        Dom.addClass(this.container, 'hidden');
    };
    return CustomTiles;
})());