var Rest = {
    host: null,
    doGet: function(url, responseType) {
        return Rest._onRequest(url, 'get', null, responseType)
    },
    doPost: function(url, data, responseType) {
        return Rest._onRequest(url, 'post', data, responseType)
    },
    doPut: function(url, data, responseType) {
        return Rest._onRequest(url, 'put', data, responseType)
    },
    doDelete: function (url, data, responseType) {
        return Rest._onRequest(url, 'delete', data, responseType)
    },
    _onRequest: function (url, type, data, responseType) {
        if(Rest.host !== null) {
            url = Rest.host + url;
        }
        return new Promise(function(resolve, reject) {
            Ajax.ajax({
                responseType: responseType ? responseType : 'json',
                type: type,
                url: url,
                data: typeof data === 'string' || typeof data === 'number' ? data : JSON.stringify(data)
            }, resolve, reject)
        })
    }
};