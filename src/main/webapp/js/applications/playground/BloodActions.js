var BloodActions = {
    blood: [
        new Image(),
        new Image(),
        new Image()
    ],
    prepareBlood: function(blood) {
        if(!blood || !blood.length)return;
        for(var i = 0; i < blood.length; i++) {
            PlayGround.blood.push(BloodActions.decrypt(blood[i]));
        }
    },
    decrypt: function(blood) {
        var data = blood.split(":");
        var randomX = Math.floor(Math.random() * 20) - 10 - 12;
        var randomY = Math.floor(Math.random() * 20) - 10 - 12;
        console.log(randomX, randomY);
        var image = Math.floor(Math.random() * 3);
        return {
            x: parseInt(data[0]) + randomX,
            y: parseInt(data[1]) + randomY,
            time: (new Date()).getTime() + 60000,
            image: BloodActions.blood[image]
        }
    },
    drawBlood: function(blood) {
        PlayGround.context.drawImage(blood.image, blood.x, blood.y);
    }
};
BloodActions.blood[0].src = 'images/map/blood1.png';
BloodActions.blood[1].src = 'images/map/blood2.png';
BloodActions.blood[2].src = 'images/map/blood3.png';