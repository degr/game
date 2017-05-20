Engine.define('Score', 'Dom', (function (Dom) {
    
    function Score(playGround) {
        this.container = null;
        this.fragContainer = null;
        this.timeContainer = null;
        this.frags = 0;
        this.sec = 0;
        /**
         * @var PlayGround
         */
        this.playGround = playGround;
        this.fragContainer = Dom.el('span', 'frags', this.frags);
        var fragWrapper = Dom.el('div', null, ['Frags: ', this.fragContainer]);

        this.timeContainer = Dom.el('span', 'time', this.frags);
        var timeWrapper = Dom.el('div', null, ['Time: ', this.timeContainer]);

        this.container = Dom.el('div', 'score', [fragWrapper, timeWrapper]);
    }
    Score.prototype.update = function (owner, time) {
        var p = this.playGround.entities[owner.id];
        if (!p)return;
        var score = p.score;
        if (score !== this.frags) {
            this.fragContainer.innerText = score;
            this.frags = score;
        }
        var sec = Math.floor(time / 1000);
        if(sec !== this.sec) {
            this.timeContainer.innerText = this.doTime(sec);
            this.sec = sec;
        }
    };
    Score.prototype.doTime = function (sec) {
        var min = Math.floor(sec / 60);
        if(isNaN(sec)) {
            sec = 0;
        }
        if(isNaN(min)) {
            min = 0;
        }
        sec = sec % 60;
        if (sec < 10) {
            sec = '0' + sec;
        }
        if (min < 10) {
            min = '0' + min;
        }
        return min + ":" + sec;
    };
    return Score;
}));