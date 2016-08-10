Engine.define('Text', (function() {
    var Dom = Engine.require('Dom');
    var AbstractInput = Engine.require('AbstractInput');
    
    function Text(name) {
        AbstractInput.apply(this, arguments);
    }
    Text.prototype = Object.create(AbstractInput.prototype);
    Text.prototype.getElementType = function() {
        return 'input'
    };
    Text.prototype.getInputType = function() {
        return 'text';
    };
    Text.prototype.constructor = Text;
    return Text;
})());