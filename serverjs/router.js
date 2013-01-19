
function route(request, response, pathname, params, handles){
    console.log('start route ' + pathname);
    //if can not found handle, use the default handle
    if ( typeof handles[pathname] === "function"){
        handles[pathname](request, response, pathname, params);
    }else{
        handles["defaultHandle"](request, response, pathname, params);
    }
}

exports.route = route;