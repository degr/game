Engine.define('Account', ['MainMenu', 'Dom', 'Rest', 'Text', 'Password'], function(){

    var MainMenu = Engine.require('MainMenu');
    var Dom = Engine.require('Dom');
    var Rest = Engine.require('Rest');
    var Text = Engine.require('Text');
    var Password = Engine.require('Password');

    function Account(context, placeApplication) {
        this.URL = 'account';
        this.TITLE = 'Account';
        var user = {
            username: context.get('username'),
            password: ''
        };
        var name = new Text({name: 'username', value: context.get('username'), onkeyup: function(){
            Rest.doPost(
                "user/is-exist", name.getValue()
            ).then(function(response){
                if(!response) {
                    name.addError('User with this name already registered!');
                } else {
                    name.addError('');
                }
            });
        }, onblur: function(){
            var value = name.getValue();
            if(value != user.username) {
                context.set('username', value);
                Rest.doPost('user/update-username', name.getValue()).then(function () {
                    user.username = value;
                    Engine.console("Username was changed");
                })
            }
        }});
        var password = new Password({name: 'password', attr: {onblur: function(){
            var value = name.getValue();
            if(value != user.password) {
                Rest.doPost(
                    'user/update-password',
                    password.getValue()
                ).then(function (r) {
                    user.password = value;
                    Engine.console('Password was changed');
                })
            }
        }}});
        Dom.addClass(password.container, 'hidden');
        this.mainMenu = new MainMenu(context, placeApplication);
        var changePass = Dom.el('a', {href: '#', onclick: function(e){
            e.preventDefault();
            Dom.removeClass(password.container, 'hidden');
            this.className = 'hidden';
        }}, 'Change Password');
        this.container = Dom.el('div', null, [
            this.mainMenu.container,
            Dom.el('h1', null, 'Account'),
            name.container,
            Dom.el('div', null, changePass),
            password.container
        ])
    }
    
    return Account;
});