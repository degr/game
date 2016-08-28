Engine.define('Ajax', (function () {
    var out = {
        /**
         * @var object with key-value pairs with default ajax headers
         */
        headers: null
    };
    out.ajax = function (data, resolve, reject) {
        var xhr = out.getXhr();
        xhr.open(data.type, data.url, true);
        var headers = out.headers;
        if (headers) {
            for (var i in headers) {
                if (headers.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, headers[i]);
                }
            }
        }
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(out.process(xhr, data.responseType), xhr);
            } else if (data.onError && reject) {
                reject(xhr)
            }
        };
        xhr.send(data.data);
        return xhr;
    };
    out.process = function (xhr, t) {
        var response = xhr.responseText;
        if(t === 'text' || !response) {
            return response; 
        } else {
            return JSON.parse(xhr.responseText);
        }
    };
    /**
     * @returns XMLHttpRequest
     */
    out.getXhr = function () {
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
    };
    return out;
})());