Engine.define('Checkbox', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Checkbox(params) {
        AbstractInput.apply(this, arguments);
        Dom.insert(this.label, this.input);
        this.input.checked = this._initChecked;
        delete(this._initChecked);
    }
    Checkbox.prototype = Object.create(AbstractInput.prototype);
    
    Checkbox.prototype.getElementType = function() {
        return 'input'
    };
    Checkbox.prototype.getInputType = function() {
        return 'checkbox';
    };

    Checkbox.prototype.getValue = function() {
        return this.input.checked;
    };
    AbstractInput.prototype.setValue = function(value) {
        this.input.checked = value;
    };
    Checkbox.prototype.prepareAttributes = function(params) {
        var out = AbstractInput.prototype.prepareAttributes.apply(this, arguments);
        this._initChecked = !!params.value;
        delete out.value;
        return out;
    };
    Checkbox.prototype.constructor = Checkbox;
    return Checkbox;
});