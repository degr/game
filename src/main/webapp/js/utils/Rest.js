Engine.define('Rest', (function () {
    var Ajax = Engine.require('Ajax');
    
    var out = {
        host: null
    };
    out.doGet = function (url, responseType) {
        return out._onRequest(url, 'get', null, responseType)
    };
    out.doPost = function (url, data, responseType) {
        return out._onRequest(url, 'post', data, responseType)
    };
    out.doPut = function (url, data, responseType) {
        return out._onRequest(url, 'put', data, responseType)
    };
    out.doDelete = function (url, data, responseType) {
        return out._onRequest(url, 'delete', data, responseType)
    };
    out._onRequest = function (url, type, data, responseType) {
        if (out.host !== null) {
            url = out.host + url;
        }
        return new Promise(function (resolve, reject) {
            Ajax.ajax({
                responseType: responseType ? responseType : 'json',
                type: type,
                url: url,
                data: typeof data === 'string' || typeof data === 'number' ? data : JSON.stringify(data)
            }, resolve, reject)
        })
    }
    return out;
})());