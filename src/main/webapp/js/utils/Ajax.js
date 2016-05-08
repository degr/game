var Ajax = {
    headers: null,
    ajax: function(data, resololve, reject){
        var xhr = Ajax.getXhr();
        xhr.open(data.type, data.url, true);
        if(Ajax.headers) {
            for(var i in Ajax.headers) {
                xhr.setRequestHeader(i, Ajax.headers[i]);
            }   
        }
        xhr.onload = function() {
            if (xhr.status == 200) {
                resololve(Ajax.process(xhr, data.type), xhr);
            } else if(data.onError && reject) {
                reject(xhr)
            }
        };
        xhr.send(data.data);
        return xhr;
    },
    process: function(xhr, t) {
        return t === 'text' ? xhr.responseText : JSON.parse(xhr.responseText);
    },
    /**
     * @returns XMLHttpRequest
     */
    getXhr: function(){
        var xmlhttp = null;
        try {
            xmlhttp = new XMLHttpRequest();
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    alert('Hey man, are you using browser?');
                }
            }
        }
        return xmlhttp;
    }
}