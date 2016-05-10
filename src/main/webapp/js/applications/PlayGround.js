var PlayGround = {
    radius: 20,
    gameStarted: false,
    
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
    
    nextFrame: null,
    interval: null,
    nextGameTick: 0,
    skipTicks: 0,
    fps:30,

    rocketRadius: 5,
    fireRadius: 7,

    init: function () {
        var weapons = PlayGround.buildWeapons();
        var canvas = Dom.el('canvas', {width: 640, height: 480, id: 'playground'});
        PlayGround.container = Dom.el('div', {'class': 'playground'}, [weapons, canvas]);
        
        PlayGround.nextGameTick = (new Date).getTime();
        PlayGround.skipTicks = 1000 / PlayGround.fps;

        PlayGround.entities = {};
        if (!canvas.getContext) {
            Console.log('Error: 2d canvas not supported by this browser.');
            return;
        }

        PlayGround.rect = canvas.getBoundingClientRect();
        PlayGround.context = canvas.getContext('2d');
        canvas.addEventListener('mousedown', PersonActions.startFire);
        canvas.addEventListener('mouseup', PersonActions.stopFire);
        window.addEventListener('keydown', PersonActions.startMovement, false);
        window.addEventListener('keyup', PersonActions.stopMovement, false);
        window.addEventListener('mousemove', PersonActions.updateMouseDirection);
        PlayGround.canvas = canvas;
    },
    buildWeapons: function () {
        return Dom.el('div');
    },
    createGame: function (name, map) {
        PlayGround.updateCanvas(map);
        PlayGround.connect("create:" + map.id + ":" + encodeURIComponent(name))
    },
    joinGame: function (map, gameId) {
        PlayGround.updateCanvas(map);
        PlayGround.connect("join:" + gameId)
    },
    updateCanvas: function(map) {
        PlayGround.map = map;
        PlayGround.canvas.style.width  = map.x + 'px';
        PlayGround.canvas.style.height = map.y + 'px';
        PlayGround.canvas.width = map.x;
        PlayGround.canvas.height = map.y;
    },
    connect: function (onConnectMessage) {
        PlayGround.gameStarted = true;
        var host;
        if (window.location.protocol == 'http:') {
            host = 'ws://' + window.location.host + '/commandos';
        } else {
            host = 'wss://' + window.location.host + '/commandos';
        }
        if ('WebSocket' in window) {
            PlayGround.socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) {
            PlayGround.socket = new MozWebSocket(host);
        } else {
            Console.log('Error: WebSocket is not supported by this browser.');
            return;
        }

        PlayGround.socket.onerror = function() {
            console.log("Error!");
            console.log(arguments);
            PlayGround.gameStarted = false;
        };
        
        PlayGround.socket.onopen = function () {
            // Socket open.. start the game loop.
            Console.log('Info: WebSocket connection opened.');
            PlayGround.socket.send(onConnectMessage);
            PlayGround.startGameLoop();
            PlayGround.gameStarted = true;
            setInterval(function () {
                // Prevent server read timeout.
                PlayGround.socket.send('ping');
            }, 5000);
        };

        PlayGround.socket.onclose = function () {
            PlayGround.stopGameLoop();
            PlayGround.gameStarted = false;
        };

        PlayGround.socket.onmessage = function (message) {
            // _Potential_ security hole, consider using json lib to parse data in production.
            var data = eval('(' + message.data + ')');
            switch (data.type) {
                case 'update':
                    PlayGround.onUpdate(data);
                    break;
                case 'leave':
                    PlayGround.removePerson(data.id);
                    break;
                case 'dead':
                    Console.log('Info: Your person is dead, bad luck!');
                    break;
                case 'kill':
                    Console.log('Info: Head shot!');
                    break;
            }
        };
    },
    onUpdate: function(packet) {
        if (packet.owner !== null) {
            PlayGround.id = packet.owner.id;
            PlayGround.owner = packet.owner;
        }
        for (var i = 0; i < packet.persons.length; i++) {
            var person = packet.persons[i];
            if (!PlayGround.entities[person.id]) {
                PlayGround.addPerson(person);
            }
            PlayGround.updatePerson(person);
        }
        PlayGround.projectiles = packet.projectiles;
    },
    addPerson: function(person) {
        PlayGround.entities[person.id] = new Person(person)
    },
    updatePerson: function(personDto) {
        var id = personDto.id;
        var p = PlayGround.entities[id];
        p.x = personDto.x;
        p.y = personDto.y;
        p.angle = personDto.angle;
        if(PlayGround.owner.id == id) {
            PersonActions.updateMouseDirectionByXy(PersonActions.xMouse, PersonActions.yMouse, p);
        }
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
            PlayGround.entities[id].draw();
        }
        if (PlayGround.projectiles != null) {
            for (var i = 0; i < PlayGround.projectiles.length; i++) {
                ProjectilesActions.draw(PlayGround.projectiles[i]);
            }
        }
    },
    stopGameLoop: function () {
        PlayGround.nextFrame = null;
        if (PlayGround.interval != null) {
            clearInterval(PlayGround.interval);
        }
    },

    updatePersonViewAngle: function(direction) {
        if(PlayGround.viewAngleDirection !== direction) {
            PlayGround.viewAngleDirection = direction;
            PlayGround.socket.send('angle:' + direction);
        }
    },
    getPerson: function(id){
        if(!id)id = PlayGround.id;
        return PlayGround.entities[id];
    }
};