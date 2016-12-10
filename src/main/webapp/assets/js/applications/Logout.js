Engine.define('Logout', ['Dom', 'Rest'], function(){
    var Dom = Engine.require('Dom');
    var Rest = Engine.require('Rest');

    function Logout(context) {
        var placeApplication = function(url, directives){
            context.dispatcher.placeApplication(url, directives);
        };
        this.container = Dom.el('div', null, 'Logging out...');
        Rest.doGet('logout').then(
            function() {
                context.remove('logged');
                placeApplication('greetings');
            }
        );
    }

    return Logout;
});