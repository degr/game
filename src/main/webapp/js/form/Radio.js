Engine.define('Radio', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Radio(params) {
        AbstractInput.apply(this, arguments);
        this.input.remove();
        delete this.input;
        
        this.params = params;
        this.options = params.options;
        this.inputs = null;
        this.optionsContainer = Dom.el('div');
        this.update(params.value);
        this.container.appendChild(this.optionsContainer);
        Dom.insert(this.label, this.input);
    }
    Radio.prototype = Object.create(AbstractInput.prototype);
    Radio.prototype.constructor = Radio;
    
    Radio.prototype.update = function(value) {
        this.optionsContainer.innerHTML = '';
        this.inputs = [];
        var name = this.params.name;
        for(var i = 0; i < this.options.length; i++) {
            var opt = this.options[i];
            var input = Dom.el('input', {
                type: 'radio',
                id: name + "_" + opt.value,
                name: name,
                value: opt.value
            });
            if(opt.value === this.getValue() || opt.value === value) {
                input.checked = true;
            }
            var listeners = {};
            for(var key in this.params) {
                if(!this.params.hasOwnProperty(key))continue;
                if((key + "").indexOf('on') === 0 && typeof this.params[key] === 'function'){
                    listeners[key] = this.params[key];
                }
            }
            Dom.addListeners(input, listeners);
            this.inputs.push(input);
            this.optionsContainer.appendChild(
                Dom.el('label', {for: name + '_' + opt.value}, [input, opt.label])
            );
        }
    };
    Radio.prototype.getElementType = function() {
        return 'input'
    };
    Radio.prototype.getInputType = function() {
        return '';
    };

    Radio.prototype.getValue = function() {
        for(var i = 0; i < this.inputs.length; i++) {
            if(this.inputs[i].checked) {
                return this.inputs[i].value;
            }
        }
        return '';
    };
    return Radio;
});