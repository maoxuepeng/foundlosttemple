//this server.js is respond to listen and dispatch message to reouter.

var http = require('http');
var url = require('url');
var router = require('./router');
var requestHandles = require('./requesthandles');

var handles = {};
handles['/'] = requestHandles.home;
handles['/team'] = requestHandles.team;
handles['defaultHandle'] = requestHandles.defaultHandle;

http.createServer(
    function onRequest(request, response){
        var pathname = url.parse(request.url).pathname;
        var params = url.parse(request.url).query
        //process css
        router.route(request, response, pathname, params, handles);
    }
    ).listen(80);
console.log('Server listened on port 80.');

