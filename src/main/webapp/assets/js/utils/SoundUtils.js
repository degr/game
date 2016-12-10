Engine.define('SoundUtils', (function () {
    var SoundUtils = {
        mute: false,
        muteMusic: false,
        currentMusic: null,
        stack: []
    };
    SoundUtils.setMute = function (value) {
        SoundUtils.mute = value;
        if (value && SoundUtils.muteMusic) {
            SoundUtils.currentMusic.pause();
        } else if (!value && SoundUtils.muteMusic && SoundUtils.currentMusic !== null) {
            SoundUtils.currentMusic.play();
        }
    };
    SoundUtils.setMuteMusic = function(muteMusic) {
        SoundUtils.muteMusic = muteMusic;
        if(muteMusic && SoundUtils.currentMusic !== null) {
            SoundUtils.currentMusic.pause();
        } else if(!muteMusic) {
            if(SoundUtils.currentMusic) {
                SoundUtils.currentMusic.play();
            } else {
                SoundUtils.nextMusic();
            }
        }
    };
    SoundUtils.play = function (path, isMusic) {
        var audio = new Audio(path);
        isMusic = isMusic || false;

        if (!SoundUtils.mute || isMusic) {
            SoundUtils.stack.push({audio: audio, isMusic: isMusic});
            audio.onended = function () {
                if (isMusic) {
                    SoundUtils.nextMusic();
                } else {
                    SoundUtils.deleteFromStack(audio);
                }
            };
        }
        if (isMusic && SoundUtils.currentMusic === null) {
            SoundUtils.currentMusic = audio;
        }
        if (!SoundUtils.mute) {
            if (!isMusic) {
                audio.play();
            } else if (!SoundUtils.muteMusic) {
                SoundUtils.muteMusic = true;
                audio.play();
            }
        }

    };
    SoundUtils.music = function (path) {
        if (typeof path === 'string') {
            SoundUtils.play(path, true);
        } else {
            for (var i = 0; i < path.length; i++) {
                SoundUtils.play(path[i], true)
            }
        }
    };
    SoundUtils.deleteFromStack = function (audio) {
        for (var i = 0; i < SoundUtils.stack.length; i++) {
            if (SoundUtils.stack[i].audio == audio) {
                if (!audio.paused) {
                    audio.pause();
                }
                SoundUtils.stack.splice(i, 1);
                return;
            }
        }
        console.log('cant delete sound: ', audio);
    };
    SoundUtils.nextMusic = function () {
        var musicToPlay = null;
        var currentFind = false;
        for (var i = 0; i < SoundUtils.stack.length; i++) {
            var obj = SoundUtils.stack[i];
            if (!obj.isMusic)continue;

            if (currentFind) {
                musicToPlay = obj.audio;
                break;
            } else {
                if (obj.audio != SoundUtils.currentMusic) {
                    musicToPlay = obj.audio;
                } else {
                    currentFind = true;
                }
            }
        }
        if (musicToPlay === null) {
            musicToPlay = SoundUtils.currentMusic;
        }
        if (musicToPlay !== null) {
            musicToPlay.currentTime = 0;
            musicToPlay.play();
            SoundUtils.currentMusic = musicToPlay;
        }
    };
    return SoundUtils;
}));