Engine.define('Rest', 'Ajax', (function () {
    var Ajax = Engine.require('Ajax');
    
    var Rest = {
        host: null
    };
    Rest.doGet = function (url, responseType) {
        return Rest._onRequest(url, 'get', null, responseType)
    };
    Rest.doPost = function (url, data, responseType) {
        return Rest._onRequest(url, 'post', data, responseType)
    };
    Rest.doPut = function (url, data, responseType) {
        return Rest._onRequest(url, 'put', data, responseType)
    };
    Rest.doDelete = function (url, data, responseType) {
        return Rest._onRequest(url, 'delete', data, responseType)
    };
    Rest._onRequest = function (url, type, data, responseType) {
        if (Rest.host !== null) {
            url = Rest.host + url;
        }
        return new Promise(function (resolve, reject) {
            Ajax.ajax({
                responseType: responseType ? responseType : 'json',
                type: type,
                url: url,
                data: typeof data === 'string' || typeof data === 'number' ? data : JSON.stringify(data)
            }, resolve, reject)
        })
    };
    return Rest;
}));