var Greetings = {
    container: null,
    name: null,
    init: function() {
        var name = localStorage.getItem('personName') || '';
        Greetings.name = Dom.el('input', {name: 'name', type: 'text', placeholder: 'Your name', value: name});
        var submit = Dom.el('input', {type: 'submit', value: 'Submit'});
        var form = Dom.el('form', {onsubmit: 'Greetings.onSubmit(event)'}, [Greetings.name, submit]);
        var window = Dom.el('div', {'class': 'window'}, [Dom.el('h1', null, 'Slaughterhouse'), form]);
        Greetings.container = Dom.el('div', {'class': 'overlay'}, window);
    },
    onSubmit: function(e) {
        e.preventDefault();
        localStorage.setItem('personName', Greetings.getName());
        Dispatcher.placeApplication('RoomsList');
        return false;
    },
    getName: function() {
        return Greetings.name.value;
    }
};