Engine.define('StringUtils', (function () {
    
    var NORMAL_TEXT_REGEXP = /([a-z])([A-Z])/g;
    var REMOVE_FIRST_LAST_SLASHES = /^(\/)|(\/)$/g;
    var LOW_DASH = /\_/g;
    
    var StringUtils = {
        unique: function (l) {
            return Math.random().toString(36).substring(2, l ? l + 2 : 7);
        },
        removeSlashes: function (str){
            return str.replace(REMOVE_FIRST_LAST_SLASHES, '');
        },
        normalizeText: function(str){
            if(!str)str = '';
            if(str.indexOf('_') > -1) {
                str = str.replace(LOW_DASH, ' ');
            }
            if(str.match(NORMAL_TEXT_REGEXP)) {
                str = str.replace(NORMAL_TEXT_REGEXP, '$1 $2');
            }
            if(str.indexOf(' ') > -1) {
                var p = str.split(' ');
                var out = '';
                for (var i = 0; i < p.length; i++) {
                    if (!p[i])continue;
                    out += p[i].charAt(0).toUpperCase() + p[i].substring(1) + (i !== p.length - 1 ? ' ' : '');
                }
                return out;
            } else {
                return str.charAt(0).toUpperCase() + str.substring(1);
            }
        }
    };
    
    return StringUtils;
})());