var Rest = {
    host: null,
    doGet: function(url) {
        return Rest._onRequest(url, 'get')
    },
    doPost: function(url, data) {
        return Rest._onRequest(url, 'post', data)
    },
    doPut: function(url, data) {
        return Rest._onRequest(url, 'put', data)
    },
    doDelete: function (url, data) {
        return Rest._onRequest(url, 'delete', data)
    },
    _onRequest: function (url, type, data) {
        if(Rest.host !== null) {
            url = Rest.host + url;
        }
        return new Promise(function(resololve, reject) {
            Ajax.ajax({
                type: type,
                url: url,
                data: typeof data === 'string' || typeof data === 'number' ? data : JSON.stringify(data)
            }, resololve, reject)
        })
    }
};