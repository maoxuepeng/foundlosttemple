var queryString = require('querystring');
var utils = require('../utils');
var fs = require('fs');

function isSingin(request, callback){
    var isLogin = (typeof request.session != "undefined" ) && ( typeof request.session.username != 'undefined' );
    console.log('isLogin = ' + isLogin);

    if ( ! isLogin ){
        callback( null, false);
        return;
    }
    console.log('request.session.username = ' + request.session.username);

    var usernameEncrypted = request.session.username;
    isNameIncluded(usernameEncrypted, function( err, isIncluded){
        if ( err ){
            callback(err, false);
        }else{
            callback(null, isIncluded);
        }
    });
}


function checkSingin(request, response, afterSingin){
    isSingin(request, function( err, isSignin ){
        if ( err || ! isSignin ){
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
            afterSingin();
        }
    });

}

function isNameIncluded(name, callback){
    var isNameIncluded = false;
    fs.readFile(process.cwd() + '/server/data/names', 'utf8', function( err, data){
        if ( err ){
            callback(err, false);
        }else{
            console.log(data);
            isNameIncluded = (data.indexOf(name) != -1);
            callback(null, isNameIncluded);
        }
        
    } );
}


/**
* the user sign in
**/
function signin(request, response){
    var loginData = '';

    request.setEncoding("utf8");
    request.on("data", function(data){
        loginData += data;
    });

    request.on("end", function(){
        //cookie max expire age in million second, 1 year
        var cookieMaxAge = 1000*3600*24*365;

        //valid use name and password
        var authInfo = queryString.parse(loginData);
        console.log(authInfo);
        var authResult = {statusCode: 0, err: ''};

        var succeed = ( 
                authInfo.teacherName == '邹时林' &&
                authInfo.femaleNum == '8' &&
                authInfo.mountain == '庐山'
            );

        isNameIncluded(authInfo.name, function( err, isIncluded){
            if ( err ){
                authResult.statusCode = -1;
                authResult.err = err;
            }else{
                console.log('isIncluded = ' + isIncluded + " && succeed = " + succeed);
                response.charset = 'utf8';
                if ( isIncluded && succeed ){
                    authResult.statusCode = 0;
                    authResult.err = null;
                    request.session.username = authInfo.name;
                    request.session.team = {currentTeam: '20434', currentAlbums: ''};

                    //set cookie for auto signin
                    response.cookie('authInfo_teacherName', toBase64(authInfo.teacherName), {maxAge: cookieMaxAge});
                    response.cookie('authInfo_femaleNum', toBase64(authInfo.femaleNum), {maxAge: cookieMaxAge});
                    response.cookie('authInfo_mountain', toBase64(authInfo.mountain), {maxAge: cookieMaxAge});
                    response.cookie('authInfo_name', toBase64(authInfo.name), {maxAge: cookieMaxAge});
                }else{
                    authResult.statusCode = -2;
                    authResult.err = 'could not auth you';
                }
            }
            //write back
            response.writeHead(200, {'Content-Type' : 'text/json'});
            response.write(JSON.stringify(authResult));
            response.end();
        });
        
    });

}

function toBase64(str){
    return new Buffer(str, 'utf8').toString('base64');
}

exports.signin = signin;
exports.isSingin = isSingin;
exports.checkSingin = checkSingin;
