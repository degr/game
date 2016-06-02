var SoundUtils = {
    mute: false,
    play: function(path) {
        if(!SoundUtils.mute) {
            (new Audio(path)).play();
        }
    }
};