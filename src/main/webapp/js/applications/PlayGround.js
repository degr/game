var PlayGround = {
    radius: 20,
    gameStarted: false,
    dev: true,
    uploadPath: "upload.images/zones/",
    container: null,
    canvas: null,
    socket: null,//websocket
        entities: {},//game persons on playground
    owner: {},//current person. Come from server with full information
    projectiles: [],//current projectiles to display
    xMouse: 0,//current x-mouse position
    yMouse: 0,//current y-mouse position,
    viewAngleDirection: 0,//current y-mouse position,
    angle: 0,
    map: {},
    canvasOffset: {top: 0, left: 0},
    
    nextFrame: null,
    interval: null,
    nextGameTick: 0,
    skipTicks: 0,
    fps:30,

    showNames: false,
    drawBounds: false,
    rocketRadius: 5,
    fireRadius: 7,
    explosionRadius: 40,//different on 20 with server
    instantBullets: {},
    readyToPlay: false,
    
    init: function () {
        PersonActions.init();
        PersonTracker.init();
        ZoneActions.init();
        Weapons.init();
        LifeAndArmor.init();
        Chat.init();
        KeyboardSetup.init();
        GameStats.init();
        Score.init();
        ScoreOverview.init();
        TeamControl.init();

        setInterval(function(){
            if(PlayGround.gameStarted) {
                var now = (new Date()).getTime() - 100;
                for (var key in PlayGround.instantBullets) {
                    var bullet = PlayGround.instantBullets[key];
                    if(bullet.created < now) {
                        delete (PlayGround.instantBullets[key]);
                    }
                }
            }
        }, 20);
        
        var openKeyboard = Dom.el('a', {'href': "#", 'class': 'icon-keyboard'});
        openKeyboard.onclick = function(e){e.preventDefault();KeyboardSetup.show()};
        
        var canvas = Dom.el('canvas', {width: 640, height: 480, id: 'playground'});
        PlayGround.container = Dom.el(
            'div',
            {'class': 'playground'},
            [
                openKeyboard, Weapons.container, Chat.container, LifeAndArmor.container,KeyboardSetup.container,
                Score.container, GameStats.container, ScoreOverview.container, TeamControl.container, canvas
            ]
        );
        
        PlayGround.nextGameTick = (new Date).getTime();
        PlayGround.skipTicks = 1000 / PlayGround.fps;

        PlayGround.entities = {};
        if (!canvas.getContext) {
            alert('Error: 2d canvas not supported by this browser.');
            return;
        }

        PlayGround.rect = canvas.getBoundingClientRect();
        PlayGround.context = canvas.getContext('2d');
        canvas.addEventListener('mousedown', PersonActions.startFire);
        canvas.addEventListener('mouseup', PersonActions.stopFire);
        var background = localStorage.getItem('background');
        canvas.style.backgroundImage = background ? background : 'url(images/map/background/1.png)';
        window.addEventListener('keydown', PersonActions.onKeyDown, false);
        window.addEventListener('keydown', Weapons.changeWeapon, false);
        window.addEventListener('keyup', PersonActions.stopMovement, false);
        window.addEventListener('mousemove', PersonActions.updateMouseDirection);
        window.addEventListener('resize', function(){PlayGround.updateCanvas(PlayGround.map)});
        PlayGround.canvas = canvas;
    },
    createGame: function (name, map) {
        PlayGround.updateCanvas(map);
        PlayGround.connect("create:" + map.id + ":" + encodeURIComponent(name) + ":" + encodeURIComponent(Greetings.getName()))
    },
    writeMessage: function (message) {
        PlayGround.socket.send("message:\n" + message);
    },
    joinGame: function (map, gameId) {
        PlayGround.updateCanvas(map);
        PlayGround.connect("join:" + gameId + ":" + encodeURIComponent(Greetings.getName()))
    },
    updateCanvas: function(map) {        
        PlayGround.map = map;
        var canvas = PlayGround.canvas;
        canvas.style.width  = map.x + 'px';
        canvas.style.height = map.y + 'px';
        canvas.width = map.x;
        canvas.height = map.y;
        var win = ScreenUtils.window();
        if (map.x < win.width) {
            canvas.style.marginLeft = 'auto';
            canvas.style.marginRight = 'auto';
            PersonTracker.trackX = false;
        } else {
            canvas.style.marginLeft = null;
            canvas.style.marginRight = null;
            PersonTracker.trackX = true;
        }
        if (map.y < win.height) {
            canvas.style.marginTop = (win.height - map.y) / 2 + 'px';
            PersonTracker.trackY = false;
        } else {
            canvas.style.marginTop = null;
            PersonTracker.trackY = true;
        }

        if(PlayGround.owner && PlayGround.owner.id) {
            PlayGround.trackPerson();
        } else {
            Dom.removeClass(document.body, 'no-overflow');
        }
        TeamControl.updateTeamHolder();
        PlayGround.canvasOffset = Dom.calculateOffset(canvas);
    },
    trackPerson: function() {
        if (PersonTracker.trackX || PersonTracker.trackY) {
            Dom.addClass(document.body, 'no-overflow');
            PersonTracker.start();
        } else {
            Dom.removeClass(document.body, 'no-overflow');
            PersonTracker.stop();
        }
    },
    connect: function (onConnectMessage) {
        PlayGround.gameStarted = true;
        PlayGround.socket = WebSocketUtils.getSocket(
            '/commandos',
            function onOpen() {
                PlayGround.socket.send(onConnectMessage);
                PlayGround.startGameLoop();
                PlayGround.gameStarted = true;
                setTimeout(function() {
                    if(PersonActions.noPassiveReload) {
                        PersonActions.updatePassiveReload(true);
                    }
                }, 2000)
            },
            function onMessage(message) {
                var data = eval('(' + message.data + ')');
                switch (data.type) {
                    case 'update':
                        PlayGround.onUpdate(data);
                        break;
                    case 'leave':
                        PlayGround.removePerson(data.id);
                        break;
                    case 'stats':
                        PlayGround.onStats(data);
                        break;
                }
            },
            function onStop() {
                PlayGround.stopGameLoop();
                PlayGround.gameStarted = false;
            },
            function onError() {
                alert("Error! Please describe how it happen to developer." + JSON.stringify(arguments));
                PlayGround.gameStarted = false;
            }
        )
    },
    onStats: function (data) {
        PlayGround.gameStarted = false;
        PersonTracker.stop();
        GameStats.show();
        GameStats.update(data.stats);
        PlayGround.socket.close();
    },
    decryptOwner: function(owner) {
        var data = owner.owner.split(":");
        return {
            id: data[0],
            life: data[1],
            armor: data[2],
            gun: data[3],
            guns: owner.guns
        };
    },
    onUpdate: function(packet) {
        if (packet.owner !== null ) {
            var oldOwnerId = PlayGround.owner.id; 
            PlayGround.owner = PlayGround.decryptOwner(packet.owner);
            if(PlayGround.owner.id != oldOwnerId) {
                PlayGround.updateCanvas(PlayGround.map);
            }
        }
        Weapons.update(PlayGround.owner);
        LifeAndArmor.update(PlayGround.owner.life, PlayGround.owner.armor);
        Score.update(PlayGround.owner, packet.time);
        if(!PlayGround.readyToPlay && packet.started == 1) {
            PlayGround.readyToPlay = true;
            TeamControl.hide();
        }
        for(var i = 0; i < packet.messages.length; i++) {
            var message = packet.messages[i];
            var id = message.substring(0, message.indexOf(":"));
            var subject = message.substring(message.indexOf(':') + 1);
            Chat.update(id, subject);
        }
        for(var j = 0; j < PlayGround.map.zones.length; j++) {
            var zone = PlayGround.map.zones[j];
            zone.available = false;
            for(var i = 0; i < packet.items.length; i++) {
                var item = packet.items[i];
                if(zone.id === item) {
                    zone.available = true;
                    break;
                }
            }
        }
        var personIds = [];
        for (var i = 0; i < packet.persons.length; i++) {
            personIds.push(PersonActions.mapPersonFromResponse(packet.persons[i]));
        }
        for(var id in PlayGround.entities) {
            if(personIds.indexOf(parseInt(id)) === -1) {
                delete PlayGround.entities[id];
            }
        }
        var now = (new Date()).getTime();
        PlayGround.projectiles = [];
        var playShootgun = false;
        if(packet.tempZones && packet.tempZones.length) {
            for(var i = 0; i < packet.tempZones.length; i++) {
                var zone = ZoneActions.decode(packet.tempZones[i]);
                ZoneActions.drawZone(zone);
            }
        }
        for(var i = 0; i < packet.projectiles.length; i++) {
            var p = ProjectilesActions.decode(packet.projectiles[i]);
            if(p.type === 'shot') {
                if(playShootgun) {
                    p.soundPlayed = true;
                } else {
                    playShootgun = true;
                }
            }
            if(p.x2 || p.x2 === 0) {
                PlayGround.instantBullets[i] = p;
                p.created = now;
            } else {
                PlayGround.projectiles.push(p);
            }
        }
    },
    addPerson: function(person) {
        PlayGround.entities[person.id] = new Person(person)
    },
    removePerson: function(id) {
        delete PlayGround.entities[id];
    },
    startGameLoop: function() {
        if (window.webkitRequestAnimationFrame) {
            PlayGround.nextFrame = function () {
                webkitRequestAnimationFrame(PlayGround.run);
            };
        } else if (window.mozRequestAnimationFrame) {
            PlayGround.nextFrame = function () {
                mozRequestAnimationFrame(PlayGround.run);
            };
        } else {
            PlayGround.interval = setInterval(PlayGround.run, 1000 / PlayGround.fps);
        }
        if (PlayGround.nextFrame != null) {
            PlayGround.nextFrame();
        }
    },
    run: function() {
        while ((new Date).getTime() > PlayGround.nextGameTick) {
            PlayGround.nextGameTick += PlayGround.skipTicks;
        }
        PlayGround.draw();
        if (PlayGround.nextFrame != null) {
            PlayGround.nextFrame();
        }
    },

    draw: function() {
        PlayGround.context.clearRect(0, 0, PlayGround.map.x, PlayGround.map.y);
        if (PlayGround.map.zones != null) {
            for (var zoneId in PlayGround.map.zones) {
                ZoneActions.drawZone(PlayGround.map.zones[zoneId]);
            }
        }
        for (var id in PlayGround.entities) {
            PersonActions.drawPerson(PlayGround.entities[id]);
        }
        var fire = {isFirePlayed: false};
        if (PlayGround.projectiles != null) {
            for (var i = 0; i < PlayGround.projectiles.length; i++) {
                ProjectilesActions.draw(PlayGround.projectiles[i], fire);
            }
        }
        for(var iKey in PlayGround.instantBullets) {
            ProjectilesActions.draw(PlayGround.instantBullets[iKey], fire);
        }
    },
    stopGameLoop: function () {
        PlayGround.nextFrame = null;
        Dom.removeClass(document.body, 'no-overflow');
        if (PlayGround.interval != null) {
            clearInterval(PlayGround.interval);
        }
    },

    updatePersonViewAngle: function(direction) {
        if(PlayGround.viewAngleDirection !== direction) {
            PlayGround.viewAngleDirection = direction;
            PlayGround.socket.send('angle:' + direction);
        }
    }
};