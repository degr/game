Engine.define('PersonTracker', (function () {
    var PersonTracker = {
        trackX: false,
        trackY: false,
        interval: null,
        isStarted: false,
        trackedContainer: null,
        maxX: 0,
        maxY: 0,
        window: {width: 0, height: 0},
        init: function () {
            PersonTracker.trackedContainer = document.body;
        },
        start: function () {
            if (PersonTracker.isStarted) {
                clearInterval(PersonTracker.interval || 0);
            }
            var ScreenUtils = Engine.require('ScreenUtils');
            PersonTracker.window = ScreenUtils.window();
            if (PersonTracker.trackY) {
                document.body.scrollTop = document.body.scrollHeight;
                PersonTracker.maxY = document.body.scrollTop;
            }
            if (PersonTracker.trackX) {
                document.body.scrollLeft = document.body.scrollWidth;
                PersonTracker.maxX = document.body.scrollLeft;
            }
            PersonTracker.isStarted = true;
            PersonTracker.interval = setInterval(function () {
                PersonTracker.track();
            }, 20)
        },
        stop: function () {
            if (PersonTracker.interval !== null) {
                clearInterval(PersonTracker.interval || 0);
            }
            PersonTracker.isStarted = false;
        },
        track: function () {
            var PlayGround = Engine.require('PlayGround');
            if (PlayGround.owner) {
                var p = PlayGround.entities[PlayGround.owner.id];
                if (PersonTracker.trackX) {
                    var x = PlayGround.map.x;
                    PersonTracker.trackedContainer.scrollLeft = PersonTracker.calculateScroll(
                        x, p.x, PersonTracker.maxX, PersonTracker.window.width);
                }
                if (PersonTracker.trackY) {
                    var y = PlayGround.map.y;
                    PersonTracker.trackedContainer.scrollTop = PersonTracker.calculateScroll(
                        y, p.y, PersonTracker.maxY, PersonTracker.window.height);
                }
            }
        },
        calculateScroll: function (map, person, scrollMax, window) {
            var half = window / 2;
            if (person / map < 0.5 && person < half) {
                return 0;
            } else if (map - person < half) {
                return scrollMax;
            } else {
                var realP = person - half;
                var realM = map - window;
                return (realP / realM) * scrollMax;
            }
        }
    };
    return PersonTracker;
})());