Engine.define('Account', ['MainMenu', 'Dom', 'Rest', 'Text', 'Password'], function(){

    var MainMenu = Engine.require('MainMenu');
    var Dom = Engine.require('Dom');
    var Rest = Engine.require('Rest');
    var Text = Engine.require('Text');
    var Password = Engine.require('Password');

    function Account(context) {
        var placeApplication = function(url, directives){
            context.dispatcher.placeApplication(url, directives);
        };
        this.URL = 'account';
        this.TITLE = 'Account';
        var me = this;
        var user = {
            username: '',
            password: ''
        };
        this.context = context;
        this.profiles = [];
        this.profilesContainer = Dom.el('div', 'profiles');
        var deleteProfile = Dom.el('button', {class: 'danger small right', onclick: function(e){
            e.preventDefault();
            var password = prompt("This action can't be undone. All profiles and all data related to this user will be removed. Please enter your password to confirm: "); 
            if(password !== null) {
                Rest.doPost(
                    'user/delete', {password: password}
                ).then(function(response){
                    if(response) {
                        Engine.console("Your account was deleted");
                        placeApplication('logout');
                    } else {
                        Engine.console("Wrong password, can't delete account");
                    }
                })
            }
        }}, 'Delete Account');
        
        var name = new Text({name: 'username', onkeyup: function(){
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
        var password = new Password({name: 'password', class: 'hidden', attr: {onblur: function(){
            var value = password.getValue();
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
        
        this.mainMenu = new MainMenu(context);
        var changePass = Dom.el('a', {href: '#', onclick: function(e){
            e.preventDefault();
            Dom.removeClass(password.container, 'hidden');
            this.className = 'hidden';
        }}, 'Change Password');
        this.container = Dom.el('div', 'account-app', [
            this.mainMenu.container,
            Dom.el('div', null, [deleteProfile, Dom.el('h1', null, 'Account')]),
            name.container,
            Dom.el('div', null, changePass),
            password.container,
            Dom.el('h3', null, [
                'User Profiles', 
                Dom.el('button', {onclick: function(){
                    me.profiles.push({
                        username: '',
                        arena: false
                    });
                    me.appendProfile(me.profiles[me.profiles.length - 1]);
                }}, 'Add Profile')
            ]),
            this.profilesContainer
        ]);
        Rest.doGet('user/acc').then(function(r){
            if(r){
                if(r.user) {
                    user.username = r.user.username;
                    name.setValue(user.username);
                }
                if(r.profiles) {
                    me.profiles = r.profiles;
                    me.buildProfiles();
                }
            }
        })
    }
    Account.prototype.appendProfile = function(profile) {
        var me = this;
        var deleteButton = Dom.el('button', {class: 'danger del small', onclick: function(){
            if(!profile.arena) {
                if(confirm('Are you sure to delete this profile?')) {
                    for(var i = 0; i < me.profiles.length; i++) {
                        if(profile == me.profiles[i]) {
                            me.profiles.splice(i, 1);
                        }
                    }
                    me.buildProfiles();
                    if(profile.id) {
                        Rest.doDelete('user/profile/' + profile.id).then(function (r) {
                            if (r) {
                                Engine.console('Profile was deleted');
                            }
                        });
                    }
                }
            } else {
                alert("Can't delete arena profile");
            }
        }}, 'delete');
        
        var name = new Text({
            name: 'profile',
            value: profile.username,
            label: 'name',
            onchange: function(){
                profile.username = name.getValue();
            },
            onblur: function() {
                me.updateProfile(profile);
            }
        });

        this.profilesContainer.appendChild(Dom.el('div', 'profile panel', [
            Dom.el('div', 'panel-heading', [profile.arena ? 'Arena Profile' : 'Persist profile', deleteButton]),
            name.container
        ]))
    };
    Account.prototype.updateProfile = function(profile) {
        var me = this;
        Rest.doPut('user/profile', profile).then(function(r){
            if(r.id) {
                Engine.console('Profile was saved');
                if(profile.arena) {
                    me.context.set('arena_name', profile.username);
                }
                profile.id = r.id;
            } else {
                Engine.console('Can\'t save profile due unknown reasons');
            }
        })
    };
    Account.prototype.buildProfiles = function() {
        this.profilesContainer.innerHTML = '';
        for(var i = 0; i < this.profiles.length; i++) {
            this.appendProfile(this.profiles[i]);
        }
    };
    return Account;
});