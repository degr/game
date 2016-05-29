var ScreenUtils = {
    window: function () {
        var e = window, a = 'inner';
        if (!( a + 'Width' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {width: e[ a+'Width' ], height : e[ a+'Height' ]};
    },
    monitor: function () {
        return {width: outerWidth, height: outerHeight}
    }
};