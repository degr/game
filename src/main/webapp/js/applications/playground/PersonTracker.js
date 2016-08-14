Engine.define('PersonTracker', (function () {
    function PersonTracker (trackedContainer, playGround) {
        if(!trackedContainer) {
            throw "Track container not defined";
        }
        this.trackX = false;
        this.trackY = false;
        this.interval = null;
        this.isStarted = false;
        this.trackedContainer = trackedContainer;
        this.maxX = 0;
        this.maxY = 0;
        this.window = {width: 0, height: 0};
        /**
         * @var PlayGround
         */
        this.playGround = playGround;
    }
    PersonTracker.prototype.start = function () {
        if (this.isStarted) {
            clearInterval(this.interval || 0);
        }
        var ScreenUtils = Engine.require('ScreenUtils');
        this.window = ScreenUtils.window();
        if (this.trackY) {
            this.trackedContainer.scrollTop = this.trackedContainer.scrollHeight;
            this.maxY = this.trackedContainer.scrollTop;
        }
        if (this.trackX) {
            this.trackedContainer.scrollLeft = this.trackedContainer.scrollWidth;
            this.maxX = this.trackedContainer.scrollLeft;
        }
        this.isStarted = true;
        var me = this;
        this.interval = setInterval(function () {
            me.track();
        }, 20)
    };
    PersonTracker.prototype.stop = function () {
        if (this.interval !== null) {
            clearInterval(this.interval || 0);
        }
        this.isStarted = false;
    };
    PersonTracker.prototype.track = function () {
        var playGround = this.playGround;
        if (playGround.owner) {
            var p = playGround.entities[playGround.owner.id];
            if (this.trackX) {
                var x = playGround.map.x;
                this.trackedContainer.scrollLeft = this.calculateScroll(
                    x, p.x, this.maxX, this.window.width);
            }
            if (this.trackY) {
                var y = playGround.map.y;
                this.trackedContainer.scrollTop = this.calculateScroll(
                    y, p.y, this.maxY, this.window.height);
            }
        }
    };
    PersonTracker.prototype.calculateScroll = function (map, person, scrollMax, window) {
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
    };
    return PersonTracker;
})());