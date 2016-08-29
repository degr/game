Engine.define('PlayGround', ['Person', 'Dom', 'Controls', 'Chat', 'Tabs',
    'PersonActions', 'SoundUtils', 'ProjectilesActions', 'PersonTracker', 'ZoneActions', 
    'WeaponActions', 'WeaponControl', 'LifeAndArmor', 'KeyboardSetup', 'GameStats', 'Score',
    'ScoreOverview', 'TeamControl', 'WebSocketUtils', 'BloodActions', 'CGraphics', 'ScreenUtils'], (function () {

    var ScreenUtils = Engine.require('ScreenUtils');
    var Person = Engine.require('Person');
    var Dom = Engine.require('Dom');
    var Controls = Engine.require('Controls');
    var Chat = Engine.require('Chat');
    var Tabs = Engine.require('Tabs');
    var PersonActions = Engine.require('PersonActions');
    var SoundUtils = Engine.require('SoundUtils');
    var ProjectilesActions = Engine.require('ProjectilesActions');
    var PersonTracker = Engine.require('PersonTracker');
    var ZoneActions = Engine.require('ZoneActions');
    var WeaponActions = Engine.require('WeaponActions');
    var WeaponControl = Engine.require('WeaponControl');
    var LifeAndArmor = Engine.require('LifeAndArmor');
    var KeyboardSetup = Engine.require('KeyboardSetup');
    var GameStats = Engine.require('GameStats');
    var Score = Engine.require('Score');
    var ScoreOverview = Engine.require('ScoreOverview');
    var TeamControl = Engine.require('TeamControl');
    var WebSocketUtils = Engine.require('WebSocketUtils');
    var BloodActions = Engine.require('BloodActions');
    var CGraphics = Engine.require('CGraphics');

    var PlayGround = function (context, placeApplication) {

        this.TITLE = 'Playground';
        this.URL = 'arena';
        this.goToMapList = false;
        
        this.radius = 20;
        this.gameStarted = false;
        this.container = null;
        this.canvas = Dom.el('canvas', {width: 640, height: 480, id: 'playground'});
        this.context = this.canvas.getContext('2d');
        this.socket = null;//websocket
        this.entities = {};//game persons on playground
        this.owner = {};//current person. Come from server with full information
        this.projectiles = [];//current projectiles to display
        this.xMouse = 0;//current x-mouse position`
        this.yMouse = 0;//current y-mouse position;
        this.viewAngleDirection = 0;//current y-mouse position,
        this.angle = 0;
        this.map = {};
        this.canvasOffset = {top: 0, left: 0};

        this.nextFrame = null;
        this.interval = null;
        this.nextGameTick = 0;
        this.skipTicks = 0;
        this.fps = 30;

        this.showNames = false;
        this.drawBounds = false;
        /*this.rocketRadius = 5;
         this.fireRadius = 7;
         this.explosionRadius = 40;//different on 20 with server*/
        this.instantBullets = [];
        this.fireBullets = {};
        this.readyToPlay = false;
        this.laserSight = 1;
        this.highlightOwner = true;
        this.blood = [];
        this.bloodTime = 60;
        this.windowInactive = false;
        this.newPlayerInterval = null;
        this.statsShown = false;
        this.rockets = [];
        /*rockets storage. For smoke visualisation*/
        this.playerName = '';
        this.placeApplication = placeApplication;
        
        this.chat = new Chat(this);
        this.personTracker = new PersonTracker(document.body, this);
        var canvas = this.canvas;
        this.weaponControl = new WeaponControl();
        
        BloodActions.playGround = this;
        this.teamControl = new TeamControl(this);
        this.gameStats = new GameStats(this, this.personTracker, this.teamControl);
        KeyboardSetup.playGround = this;
        KeyboardSetup.chat = this.chat;
        PersonActions.playGround = this;
        ProjectilesActions.playGround = this;
        this.score = new Score(this);
        this.scoreOverview = new ScoreOverview(this);
        WeaponActions.playGround = this;
        ZoneActions.playGround = this;

        PersonActions.init();
        ProjectilesActions.init();
        ZoneActions.init();
        this.lifeAndArmor = new LifeAndArmor();
        KeyboardSetup.init();

        var me = this;
        setInterval(function () {
            if (me.gameStarted) {
                if (!me.musicStarted) {
                    me.musicStarted = true;
                    /*SoundUtils.music([
                     "sound/music/04.ogg",
                     "sound/music/05.ogg"
                     ]);*/
                }
                var now = (new Date()).getTime();
                for (var key = me.instantBullets.length - 1; key >= 0; key--) {
                    var bullet = me.instantBullets[key];
                    if (bullet.created < now - bullet.lifeTime) {
                        me.instantBullets.splice(key, 1);
                    }
                }
                for (var i = me.blood.length - 1; i >= 0; i--) {
                    if (me.blood[i].time < now) {
                        me.blood.splice(i, 1);
                    }
                }

            }
        }, 20);

        var openKeyboard = Dom.el('a', {'href': "#", 'class': 'icon-keyboard'});
        openKeyboard.onclick = function (e) {
            e.preventDefault();
            KeyboardSetup.show()
        };

        this.container = Dom.el(
            'div',
            {'class': 'playground'},
            [
                openKeyboard, this.weaponControl.container, this.chat.container, this.lifeAndArmor.container, KeyboardSetup.container,
                this.score.container, this.gameStats.container, this.scoreOverview.container, this.teamControl.container, canvas
            ]
        );

        this.nextGameTick = (new Date).getTime();
        this.skipTicks = 1000 / me.fps;

        if (!canvas.getContext) {
            alert('Error: 2d canvas not supported by this browser.');
            return;
        }

        this.rect = canvas.getBoundingClientRect();
        CGraphics.context = this.context;
        canvas.addEventListener('mousedown', function(e){PersonActions.startFire(e)});
        canvas.addEventListener('mouseup', function(e){PersonActions.stopFire(e)});
        var background = localStorage.getItem('background');
        canvas.style.backgroundImage = background ? background : 'url(images/map/background/1.png)';
        this.windowListeners = {
            keydown: [
                function(e){PersonActions.onKeyDown(e)},
                function(e){WeaponActions.changeWeapon(e)},
                function(e){if(e.keyCode === 27){placeApplication("Greetings")}}
            ],
            keyup: function(e){PersonActions.stopMovement(e)},
            mousemove: function(e){PersonActions.updateMouseDirection(e)},
            resize: function () {me.updateCanvas(me.map)},
            focus: function () {
                if (me.newPlayerInterval !== null) {
                    clearInterval(me.newPlayerInterval || 0);
                    me.newPlayerInterval = null;
                }
                me.windowInactive = false;
                window.document.getElementsByTagName('title')[0].innerHTML = 'Kill Them All'
            },
            blur: function () {
                me.windowInactive = true;
            }
        };
        Dom.addListeners(this.windowListeners);
    };
    PlayGround.prototype.afterOpen = function (directives) {
        if(this.goToMapList) {
            this.placeApplication("RoomList");
        }
    };
    PlayGround.prototype.beforeOpen = function (directives) {
        KeyboardSetup.addListeners();
        var dto;
        if(directives.joinGame) {
            dto = directives.joinGame; 
            this.joinGame(dto.map, dto.roomId);
        } else if(directives.createGame) {
            dto = directives.createGame;
            this.createGame(dto.name, dto.map);
        } else {
            this.goToMapList = true;
        }
    };
    PlayGround.prototype.beforeClose = function () {
        Dom.removeListeners(this.windowListeners);
        this.scoreOverview.removeListeners();
        this.chat.removeListeners();
        KeyboardSetup.removeListeners();
        this.stopGameLoop();
        this.socket.close();
    };
    PlayGround.prototype.createGame = function (name, map) {
        this.updateCanvas(map);
        this.connect("create:" + map.id + ":" + encodeURIComponent(name) + ":" + encodeURIComponent(this.playerName))
    };
    PlayGround.prototype.writeMessage = function (message) {
        this.socket.send("message:\n" + message);
    };
    PlayGround.prototype.joinGame = function (map, gameId) {
        this.updateCanvas(map);
        this.connect("join:" + gameId + ":" + encodeURIComponent(this.playerName))
    };
    PlayGround.prototype.updateCanvas = function (map) {
        this.map = map;
        var canvas = this.canvas;
        canvas.style.width = map.x + 'px';
        canvas.style.height = map.y + 'px';
        canvas.width = map.x;
        canvas.height = map.y;
        var win = ScreenUtils.window();
        if (map.x < win.width) {
            canvas.style.marginLeft = 'auto';
            canvas.style.marginRight = 'auto';
            this.personTracker.trackX = false;
        } else {
            canvas.style.marginLeft = null;
            canvas.style.marginRight = null;
            this.personTracker.trackX = true;
        }
        if (map.y < win.height) {
            canvas.style.marginTop = (win.height - map.y) / 2 + 'px';
            this.personTracker.trackY = false;
        } else {
            canvas.style.marginTop = null;
            this.personTracker.trackY = true;
        }

        if (this.owner && this.owner.id) {
            this.trackPerson();
        } else {
            Dom.removeClass(document.body, 'no-overflow');
        }
        this.teamControl.updateTeamHolder();
        this.canvasOffset = Dom.calculateOffset(canvas);
    };
    PlayGround.prototype.trackPerson = function () {
        if (this.personTracker.trackX || this.personTracker.trackY) {
            Dom.addClass(document.body, 'no-overflow');
            this.personTracker.start();
        } else {
            Dom.removeClass(document.body, 'no-overflow');
            this.personTracker.stop();
        }
    };
    PlayGround.prototype.connect = function (onConnectMessage) {
        this.gameStarted = true;
        var me = this;
        this.socket = WebSocketUtils.getSocket(
            'commandos',
            function onOpen() {
                me.socket.send(onConnectMessage);
                me.startGameLoop();
                me.gameStarted = true;
                setTimeout(function () {
                    if (PersonActions.noPassiveReload) {
                        PersonActions.updatePassiveReload(true);
                    }
                }, 2000)
            },
            function onMessage(message) {
                var data = eval('(' + message.data + ')');
                switch (data.type) {
                    case 'update':
                        me.onUpdate(data);
                        break;
                    case 'leave':
                        me.removePerson(data.id);
                        break;
                    case 'stats':
                        if (!me.statsShown) {
                            me.teamControl.readyCheckbox.checked = false;
                            me.statsShown = true;
                            me.onStats(data);
                        }
                        break;
                }
            },
            function onStop() {
                me.stopGameLoop();
                me.gameStarted = false;
            },
            function onError() {
                alert("Error! Please describe how it happen to developer." + JSON.stringify(arguments));
                me.gameStarted = false;
            }
        )
    };
    PlayGround.prototype.onStats = function (data) {
        this.gameStarted = false;
        this.personTracker.stop();
        this.gameStats.show();
        this.teamControl.show();
        this.gameStats.update(data.stats, parseInt(data.team1Score), parseInt(data.team2Score));
    };
    PlayGround.prototype.decryptOwner = function (owner) {
        var data = owner.owner.split(":");
        return {
            id: data[0],
            life: data[1],
            armor: data[2],
            gun: data[3],
            guns: owner.guns
        };
    };
    PlayGround.prototype.onUpdate = function (packet) {
        if (packet.map) {
            this.updateCanvas(packet.map)
        }
        if (packet.started == 1 && (this.teamControl.isShown || !this.readyToPlay)) {
            this.teamControl.hide();
            this.readyToPlay = true;
        } else if (!packet.started && (!this.teamControl.isShown)) {
            this.readyToPlay = false;
            this.teamControl.show();
        }
        if (packet.owner !== null) {
            var oldOwnerId = this.owner.id;
            this.owner = this.decryptOwner(packet.owner);
            if (this.owner.id != oldOwnerId) {
                this.updateCanvas(this.map);
            }
        }
        var owner = this.owner;
        if (packet.score) {
            this.scoreOverview.updateTeamScore(packet.score);
        }
        this.weaponControl.update(owner);
        this.lifeAndArmor.update(owner.life, owner.armor);
        this.score.update(owner, packet.time);
        for (var m = 0; m < packet.messages.length; m++) {
            var message = packet.messages[m];
            var mId = parseInt(message.substring(0, message.indexOf(":")));
            var subject = message.substring(message.indexOf(':') + 1);
            this.chat.update(mId, subject);
        }
        var zones = this.map.zones;
        for (var j = 0; j < zones.length; j++) {
            var zone = zones[j];
            zone.available = false;
            for (var i = 0; i < packet.items.length; i++) {
                var item = packet.items[i];
                if (zone.id === item) {
                    zone.available = true;
                    break;
                }
            }
        }
        this.tempZones = [];
        if (packet.tempZones && packet.tempZones.length) {
            for (var z = 0; z < packet.tempZones.length; z++) {
                var tempZone = ZoneActions.decode(packet.tempZones[z]);
                tempZone.available = true;
                this.tempZones.push(tempZone);
            }
        }
        var personIds = [];
        for (var p = 0; p < packet.persons.length; p++) {
            personIds.push(PersonActions.mapPersonFromResponse(packet.persons[p]));
        }
        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id) && personIds.indexOf(parseInt(id)) === -1) {
                delete this.entities[id];
            }
        }

        BloodActions.prepareBlood(packet.blood);
        this.projectiles = [];
        ProjectilesActions.decode(packet.projectiles);
    };
    PlayGround.prototype.addPerson = function (id) {
        this.entities[id] = new Person(id)
    };
    PlayGround.prototype.removePerson = function (id) {
        delete this.entities[id];
    };
    PlayGround.prototype.startGameLoop = function () {
        var me = this;
        if (window.webkitRequestAnimationFrame) {
            this.nextFrame = function () {
                webkitRequestAnimationFrame(function () {
                    me.run()
                });
            };
        } else if (window.mozRequestAnimationFrame) {
            this.nextFrame = function () {
                mozRequestAnimationFrame(function () {
                    me.run()
                });
            };
        } else {
            this.interval = setInterval(function () {
                me.run()
            }, 1000 / this.fps);
        }
        if (this.nextFrame != null) {
            this.nextFrame();
        }
    };
    PlayGround.prototype.run = function () {
        while ((new Date).getTime() > this.nextGameTick) {
            this.nextGameTick += this.skipTicks;
        }
        this.draw();
        if (this.nextFrame != null) {
            this.nextFrame();
        }
    };

    PlayGround.prototype.draw = function () {
        this.context.clearRect(0, 0, this.map.x, this.map.y);
        
        var blood = this.blood;
        if (blood && blood.length) {
            for (var bloodId = 0; bloodId < blood.length; bloodId++) {
                BloodActions.drawBlood(blood[bloodId]);
            }
        }
        var zones = this.map.zones;
        if (zones != null) {

            for (var zoneId in zones) {
                if (zones.hasOwnProperty(zoneId)) {
                    ZoneActions.drawZone(zones[zoneId]);
                }
            }
        }
        if (this.tempZones && this.tempZones.length) {
            for (var tempZoneId = 0; tempZoneId < this.tempZones.length; tempZoneId++) {
                ZoneActions.drawZone(this.tempZones[tempZoneId]);
            }
        }
        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                PersonActions.drawPerson(this.entities[id]);
            }
        }
        var fire = {isFirePlayed: false};
        if (this.projectiles != null) {
            for (var i = 0; i < this.projectiles.length; i++) {
                ProjectilesActions.draw(this.projectiles[i], fire);
            }
        }
        for (var iKey = 0; iKey < this.instantBullets.length; iKey++) {
            ProjectilesActions.draw(this.instantBullets[iKey], fire);
        }
    };
    PlayGround.prototype.stopGameLoop = function () {
        this.nextFrame = null;
        Dom.removeClass(document.body, 'no-overflow');
        if (this.interval != null) {
            clearInterval(this.interval || 0);
        }
    };

    PlayGround.prototype.updatePersonViewAngle = function (angle) {
        if (this.viewAngleDirection !== angle) {
            this.viewAngleDirection = angle;
            this.socket.send('angle:' + angle);
        }
    };

    return PlayGround;
}));
