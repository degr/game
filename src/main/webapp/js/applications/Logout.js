Engine.define('Logout', ['Dom', 'Rest'], function(){
    var Dom = Engine.require('Dom');
    var Rest = Engine.require('Rest');

    function Logout(context, placeApplication) {
        this.container = Dom.el('div', null, 'Logging out...');
        Rest.doGet('logout').then(
            function() {
                context.remove('logged');
                placeApplication('Greetings');
            }
        );
    }

    return Logout;
});