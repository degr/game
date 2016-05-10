var Console = {
    screen: null,
    getConsole: function() {
        if(Console.screen === null) {
            Console.screen = Dom.el('div', {id: 'console'});
            document.body.appendChild(Console.screen)
        }
        return Console.screen;
    }
};

Console.log = function(message) {
    var console = Console.getConsole();
    var p = document.createElement('p');
    p.style.wordWrap = 'break-word';
    p.innerHTML = message;
    console.appendChild(p);
    while (console.childNodes.length > 25) {
        console.removeChild(console.firstChild);
    }
    console.scrollTop = console.scrollHeight;
};