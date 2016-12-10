Engine.define('GenericForm', ['Dom', 'Text'], function(){
    
    var Dom = Engine.require('Dom');
    var Text = Engine.require('Text');

    function GenericForm(data, meta, onSubmit) {
        if(!onSubmit)throw 'onSubmit is required for generic form';
        var html = [];
        var me = this;
        this.fields = [];
        this.model = {};
        this.onSubmitSuccess = onSubmit;
        if(!meta) {
            meta = {};
        }
        this.meta = meta;
        for(var key in data) {
            if(!data.hasOwnProperty(key))continue;
            var value = data[key];
            this.model[key] = value;
            var field;
            if(meta[key]) {
                var m = meta[key];
                if(m.ignore)continue;
                field = m.render ? 
                    (typeof m.render === "function" ? m.render(this.onChange, key, value) : m.render) : 
                    this.buildText(key, value, m.onchange);
                this.fields.push(field);
                var content = [
                    typeof m.contentBefore === 'function' ? m.contentBefore(key, value) : m.contentBefore,
                    field.container,
                    typeof m.contentAfter === 'function' ? m.contentAfter(key, value) : m.contentAfter
                ];
                if(m.wrapper) {
                    if(typeof m.wrapper === 'function') {
                        html.push(m.wrapper(content, key, value));
                    } else {
                        Dom.append(m.wrapper(content));
                        html.push(m.wrapper);
                    }
                } else {
                    html = html.concat(content);
                }
            } else {
                field = this.buildText(key, value);
                this.fields.push(field);
                html.push(field.container)
            }
        }
        
        this.submit = Dom.el('div', null, Dom.el('input', {type: 'submit', class: 'primary', value: 'Submit'}));
        this.container = Dom.el('form', null, [html, this.submit]);
        this.container.onsubmit = function(e){
            me.onSubmit(e)
        }
    }
    
    GenericForm.prototype.onSubmit = function(e){
        if(e)e.preventDefault();
        if(this.validate) {
            this.onSubmitSuccess(this.model)
        }
    };
    GenericForm.prototype.validate = function(){
        if(this.meta) {
            for(var key in this.meta) {
                if(!this.meta.hasOwnProperty(key))continue;
                var m = this.meta[key];
                if(m.validations) {
                    
                }
            }
            return true;
        } else {
            return true;
        }
    };
    GenericForm.prototype.onChange = function(key, value){
        this.model[key] = value;
    };
    GenericForm.prototype.buildText = function(key, value, onchange){
        var me = this;
        var out = new Text({name: key, value: value, onchange: function(e){
            me.onChange(key, out.getValue());
            if(onchange){
                onchange();
            }
        }});
        return out;
    };
    
    return GenericForm;
});