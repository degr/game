Engine.define('Password', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Password(params) {
        AbstractInput.apply(this, arguments);
        this.showChars = params.showChars || false;
        var me = this;
        this.toggler = Dom.el('a', {href: '#', onclick: function(e){
            e.preventDefault();
            me.toggleInput();
        }}, [this.getTogglerContent()]);
        this.container.appendChild(this.toggler);
    }
    Password.prototype = Object.create(AbstractInput.prototype);

    Password.prototype.getElementType = function() {
        return 'input'
    };
    Password.prototype.toggleInput = function() {
        this.showChars = !this.showChars;
        this.input.type = this.getInputType();
        this.toggler.innerHTML = this.getTogglerContent();
    };
    Password.prototype.getTogglerContent = function() {
        return this.showChars ? 'Hide' : 'Show';
    };
    Password.prototype.getInputType = function() {
        return this.showChars ? 'text' : 'password';
    };
    Password.prototype.constructor = Password;
    return Password;
});