var utils = require('../utils');
var fs = require('fs');
var queryString = require('querystring');
var url = require('url');

var pagedown = require("pagedown");
var converter = new pagedown.Converter();

var authMgmg = require('../usermgmt/auth_question');

/**
* Global variable store the all articals meta data.
*/
var allArticalMetaData = {metaList: []};


/**
* get all artical meta data.
* return data format:
* {metaList: [title: 'myartical', creationDateTime: '2013-7-14 14:34:21', absolutePath: '/tmp/myartical.md']}
* input param format: none
*/
function getAllArticalMetaData(request, response){
    //check permission
    var pass = true;
    authMgmg.isSingin(request, function( err, isSingin ){
        if ( err || ! isSingin ){
            pass = false;
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }
    });
    if ( ! pass ){
        return;
    }

    //empty the cache
    allArticalMetaData.metaList = [];

    utils.walkDirectory( 
        process.cwd() + '/server/data/articals', 
        {followLinks : false}, 
        function( root, fileStats ){
            if ( utils.stringEndWith(fileStats.name, ".md") ){
                //tmp variable
                var meta = {};

                //delte the .md from file name
                meta.title = fileStats.name.slice(0, -3);
                meta.absolutePath = root + '/' + fileStats.name;
                meta.creationDateTime = fs.statSync(meta.absolutePath).mtime.toLocaleDateString('zh-CN');

                allArticalMetaData.metaList.push(meta);

            }
            return true;
        },
        function(){
            //write response back
            response.writeHead(200, {'Content-Type' : 'text/json'});
            response.write(JSON.stringify(allArticalMetaData));
            response.end();
        }
    );
}

/**
* get one artical as html format.
* return data format: {articalHTML: 'xxxxxx'}
* input param format: title=xxxxx
*/
function getArticalAsHTML(request, response){
    //check permission
    var pass = true;
    authMgmg.isSingin(request, function( err, isSingin ){
        if ( err || ! isSingin ){
            pass = false;
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }
    });
    if ( ! pass ){
        return;
    }

    request.setEncoding('utf8');

    var clientData = url.parse(request.url).query;
    var clientParam = queryString.parse(clientData);
    console.log(clientParam);
    var path = getAbsolutePathByTitleSync(clientParam.title);

    var ret = {articalHTML: ''};
    fs.readFile(path, 'utf8', function( err, data ){
        if ( err ){
            console.log(err);
            ret.articalHTML = '<h3>Sorry there are some error in the server...</h3>';
        }else{
            ret.articalHTML = converter.makeHtml(data);
        }
        //send back to client
        response.writeHead(200, {'Content-Type' : 'text/json'});
        response.write(JSON.stringify(ret));
        response.end();
    });
}

function getAbsolutePathByTitleSync(title){
    if ( ! allArticalMetaData || allArticalMetaData.metaList.length === 0 ){
        return null;
    }

    var tmp;
    for ( var i = 0; i < allArticalMetaData.metaList.length; i++ ){
        tmp = allArticalMetaData.metaList[i];
        if ( title == tmp.title ){
            return tmp.absolutePath;
        }
    }
    return null;
}

exports.getAllArticalMetaData = getAllArticalMetaData;
exports.getArticalAsHTML = getArticalAsHTML;