Engine.define('Score', (function () {

    var Dom = Engine.require('Dom');
    
    var Score = {
        container: null,
        fragContainer: null,
        timeContainer: null,
        frags: 0,
        /**
         * @var PlayGround
         */
        playGround: null,
        init: function () {
            Score.fragContainer = Dom.el('span', 'frags', Score.frags);
            var fragWrapper = Dom.el('div', null, ['Frags: ', Score.fragContainer]);

            Score.timeContainer = Dom.el('span', 'time', Score.frags);
            var timeWrapper = Dom.el('div', null, ['Time: ', Score.timeContainer]);

            Score.container = Dom.el('div', 'score', [fragWrapper, timeWrapper]);
        },
        update: function (owner, time) {
            var p = Score.playGround.entities[owner.id];
            if (!p)return;
            var score = p.score;
            if (score != Score.frags) {
                Score.fragContainer.innerText = score;
                Score.frags = score;
            }
            Score.timeContainer.innerText = Score.doTime(time);
        },
        doTime: function (millis) {
            var sec = Math.floor(millis / 1000);
            var min = Math.floor(sec / 60);
            sec = sec % 60;
            if (sec < 10) {
                sec = '0' + sec;
            }
            if (min < 10) {
                min = '0' + min;
            }
            return min + ":" + sec;
        }
    };
    return Score
})());