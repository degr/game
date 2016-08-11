Engine.define("AbstractInput", (function(){
    
    var Dom = Engine.require("Dom");
    var StringUtils = Engine.require("StringUtils");
    
    function AbstractInput(params) {
        if(!params.name)throw "Name is reqired for input";
        this.input = Dom.el(this.getElementType(), this.prepareAttributes(params), this.prepareContent(params));
        this.label = this.buildLabel(params);
        this.container = Dom.el('div', 'formfield-holder ' + (params.class || ''), [this.label, this.input]);
    };

    
    AbstractInput.prototype.buildLabel = function(params) {
        var content;
        if(params.noLabel === true) {
            content = null;
        } else if(params.label) {
            content = params.label;
        } else {
            content = StringUtils.normalizeText(params.name);
        }
        var attr = {};
        if(params.id) {
            attr.id = params.id;
        } else if(params.formId) {
            attr.id = params.formId + "_" + params.name;
        } else {
            attr.id = params.name;
        }
        return Dom.el('label', attr, content);
    };
    AbstractInput.prototype.getInputType = function() {
        throw "This function must be overrided";
    };
    AbstractInput.prototype.getElementType = function() {
        throw "This function must be overrided";
    };
    AbstractInput.prototype.prepareContent = function(params) {
        return null;
    };
    AbstractInput.prototype.prepareAttributes = function(params) {
        var out = {
            value: params.value,
            name: params.name,
            type: this.getInputType(),
            id: params.id
        };
        if(params.params) {
            for(var key in params.params) {
                if(params.params.hasOwnProperty(key)) {
                    out[key] = params.params[key];
                }
            } 
        }
        for(var k in params) {
            if(!params.hasOwnProperty(k))continue;
            if(k.indexOf('on') === 0) {
                out[k] = params[k];
            }
        }
        return out;
    };
    
    AbstractInput.prototype.getValue = function() {
        return this.input.value;
    };
    return AbstractInput;
})());