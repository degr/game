
var Game = {};

Game.fps = 30;
Game.socket = null;
Game.nextFrame = null;
Game.interval = null;
Game.radius = 20;
Game.angle = 0;
Game.xMouse = null;//current mouse x position
Game.yMouse = null;//current mouse y position
Game.rect = null;//game square rectangle
Game.id = null;//your person id
Game.zones = null;//all person (include your)
Game.entities = null;//all person (include your)
Game.projectiles = null;//all person (include your)
Game.viewAngleDirection = null;
Game.rocketRadius = 5;
Game.fireRadius = 7;

Game.getPerson = function(id){
    if(!id)id = Game.id;
    return Game.entities[id];
};
Game.initialize = function() {
    Game.entities = {};
    canvas = document.getElementById('playground');
    if (!canvas.getContext) {
        Console.log('Error: 2d canvas not supported by this browser.');
        return;
    }

    Game.rect = canvas.getBoundingClientRect();
    Game.context = canvas.getContext('2d');
    canvas.addEventListener('mousedown', PersonActions.startFire);
    canvas.addEventListener('mouseup', PersonActions.stopFire);
    window.addEventListener('keydown', PersonActions.startMovement, false);
    window.addEventListener('keyup', PersonActions.stopMovement, false);
    canvas.addEventListener('mousemove', PersonActions.updateMouseDirection);
    if (window.location.protocol == 'http:') {
        Game.connect('ws://' + window.location.host + '/commandos');
    } else {
        Game.connect('wss://' + window.location.host + '/commandos');
    }
};

Game.startGameLoop = function() {
    if (window.webkitRequestAnimationFrame) {
        Game.nextFrame = function () {
            webkitRequestAnimationFrame(Game.run);
        };
    } else if (window.mozRequestAnimationFrame) {
        Game.nextFrame = function () {
            mozRequestAnimationFrame(Game.run);
        };
    } else {
        Game.interval = setInterval(Game.run, 1000 / Game.fps);
    }
    if (Game.nextFrame != null) {
        Game.nextFrame();
    }
};

Game.stopGameLoop = function () {
    Game.nextFrame = null;
    if (Game.interval != null) {
        clearInterval(Game.interval);
    }
};

Game.draw = function() {
    Game.context.clearRect(0, 0, 640, 480);
    if(Game.zones != null) {
        for (var zoneId in Game.zones) {
            ZoneActions.drawZone(Game.zones[zoneId], Game.context);
        }
    }
    for (var id in Game.entities) {
        Game.entities[id].draw(Game.context);
    }
    if(Game.projectiles != null) {
        for (var i = 0; i < Game.projectiles.length; i++) {
            ProjectilesActions.draw(Game.projectiles[i]);
        }
    }
};

Game.addPerson = function(person) {
    var p = new Person(person);
    Game.entities[person.id] = p;
};

Game.updatePerson = function(personDto) {
    var id = personDto.id;
    if (typeof Game.entities[id] != "undefined") {
        var p = Game.entities[id]; 
        p.x = personDto.x;
        p.y = personDto.y;
        p.angle = personDto.angle;
        if(Game.id == id) {
            PersonActions.updateMouseDirectionByXy(Game.xMouse, Game.yMouse, p);
        }
        
    }
};

Game.removePerson = function(id) {
    Game.entities[id] = null;
    // Force GC.
    delete Game.entities[id];
};

Game.run = (function() {
    var skipTicks = 1000 / Game.fps, nextGameTick = (new Date).getTime();

    return function() {
        while ((new Date).getTime() > nextGameTick) {
            nextGameTick += skipTicks;
        }
        Game.draw();
        if (Game.nextFrame != null) {
            Game.nextFrame();
        }
    };
})();
Game.createSelfPerson = function(){
    Game.socket.send("join");
};
Game.updatePersonViewAngle = function(direction) {
    if(Game.viewAngleDirection !== direction) {
        Game.viewAngleDirection = direction;
        Game.socket.send('angle:' + direction);
    }
};
Game.connect = (function(host) {
    if ('WebSocket' in window) {
        Game.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Game.socket = new MozWebSocket(host);
    } else {
        Console.log('Error: WebSocket is not supported by this browser.');
        return;
    }

    Game.socket.onopen = function () {
        // Socket open.. start the game loop.
        Console.log('Info: WebSocket connection opened.');
        Console.log('Info: Press an arrow key to begin.');
        Game.createSelfPerson();
        Game.startGameLoop();
        setInterval(function() {
            // Prevent server read timeout.
            Game.socket.send('ping');
        }, 5000);
    };

    Game.socket.onclose = function () {
        Console.log('Info: WebSocket closed.');
        Game.stopGameLoop();
    };

    Game.socket.onmessage = function (message) {
        // _Potential_ security hole, consider using json lib to parse data in production.
        var packet = eval('(' + message.data + ')');
        switch (packet.type) {
            case 'update':
                for (var i = 0; i < packet.persons.length; i++) {
                    var person = packet.persons[i];
                    
                    if(!Game.entities[person.id]) {
                        Game.addPerson(person);
                    }
                    Game.updatePerson(person);
                }
                if(packet.zones) {
                    Game.zones = packet.zones;
                }
                if (Game.id === null && packet.owner) {
                    Game.id = packet.owner.id;
                }
                Game.projectiles = packet.projectiles;
                break;
            case 'leave':
                Game.removePerson(packet.id);
                break;
            case 'dead':
                Console.log('Info: Your person is dead, bad luck!');
                break;
            case 'kill':
                Console.log('Info: Head shot!');
                break;
        }
    };
});