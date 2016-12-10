Engine.define('BloodActions', (function () {
    var BloodActions = {
        /**
         * @var PlayGround
         */
        playGround: null,
        blood: [
            new Image(),
            new Image(),
            new Image()
        ],
        prepareBlood: function (blood) {
            if (!blood || !blood.length)return;
            for (var i = 0; i < blood.length; i++) {
                BloodActions.playGround.blood.push(BloodActions.decrypt(blood[i]));
            }
        },
        decrypt: function (blood) {
            var data = blood.split(":");
            var randomShift = 22;
            var randomX = Math.floor(Math.random() * randomShift * 2) - randomShift - 12;
            var randomY = Math.floor(Math.random() * randomShift * 2) - randomShift - 12;
            var image = Math.floor(Math.random() * BloodActions.blood.length);
            return {
                x: parseInt(data[0]) + randomX,
                y: parseInt(data[1]) + randomY,
                time: (new Date()).getTime() + BloodActions.playGround.bloodTime * 1000,
                image: BloodActions.blood[image]
            }
        },
        drawBlood: function (blood) {
            BloodActions.playGround.context.drawImage(blood.image, blood.x, blood.y);
        }
    };
    BloodActions.blood[0].src = 'images/map/blood1.png';
    BloodActions.blood[1].src = 'images/map/blood2.png';
    BloodActions.blood[2].src = 'images/map/blood3.png';
    return BloodActions
}));