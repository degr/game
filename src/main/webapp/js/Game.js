
var Game = {};

Game.fps = 30;
Game.socket = null;
Game.nextFrame = null;
Game.interval = null;
Game.radius = 15;
Game.xMouse = null;//current mouse x position
Game.yMouse = null;//current mouse y position
Game.rect = null;//game square rectangle
Game.id = null;//your person id
Game.entities = null;//all person (include your)
Game.projectiles = null;//all person (include your)

Game.initialize = function() {
    Game.entities = {};
    canvas = document.getElementById('playground');
    if (!canvas.getContext) {
        Console.log('Error: 2d canvas not supported by this browser.');
        return;
    }

    Game.rect = canvas.getBoundingClientRect();
    Game.context = canvas.getContext('2d');
    canvas.addEventListener('click', PersonActions.doShot);
    window.addEventListener('keydown', PersonActions.startMovement, false);
    window.addEventListener('keyup', PersonActions.stopMovement, false);
    canvas.addEventListener('mousemove', PersonActions.updateMouseDirection);
    if (window.location.protocol == 'http:') {
        Game.connect('ws://' + window.location.host + '/examples/websocket/snake');
    } else {
        Game.connect('wss://' + window.location.host + '/examples/websocket/snake');
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
    for (var id in Game.entities) {
        Game.entities[id].draw(Game.context);
    }
    for (var id in Game.projectiles) {
        ProjectilesActions.draw(Game.projectiles[id]);
    }
};

Game.addPerson = function(id, hexColor) {
    Game.entities[id] = new Person();
    Game.entities[id].hexColor = hexColor;
};

Game.updatePerson = function(id, location) {
    if (typeof Game.entities[id] != "undefined") {
        Game.entities[id].location = location;
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
                for (var i = 0; i < packet.data.length; i++) {
                    Game.updatePerson(packet.data[i].id, packet.data[i].location);
                }
                Game.projectiles = packet.projectiles;
                break;
            case 'join':
                Game.id = packet.id;
                for (var j = 0; j < packet.data.length; j++) {
                    Game.addPerson(packet.data[j].id, packet.data[j].hexColor);
                }
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