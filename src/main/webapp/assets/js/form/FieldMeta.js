Engine.define('FieldMeta', function(){
    function FieldMeta(params){
        if(!params)params = {};
        this.ignore = params.ignore || false;//this field will be ignored
        this.render = params.render || null;//render for current field. Should be component with container
        this.wrapper = params.wrapper || null;//if defined, all content will be putted inside of it. DOM node or function
        this.contentBefore = params.contentBefore || null;
        this.contentAfter = params.contentAfter || null;
        this.onchange = params.onchange || null;//callback function for onchange
        this.validations = params.validations || null;//validation rules
    }
    return FieldMeta;
});