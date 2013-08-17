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
var ARTICAL_PATH = process.cwd() + '/server/data/articals/20434';


/**
* get all artical meta data.
* return data format:
* {metaList: [title: 'myartical', creationDateTime: '2013-7-14 14:34:21', absolutePath: '/tmp/myartical.md']}
* input param format: none
*/
function getAllArticalMetaData(request, response){
    //check permission
    authMgmg.isSingin(request, function( err, isSingin ){
        if ( err || ! isSingin ){
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
            //empty the cache
            allArticalMetaData.metaList = [];

            utils.walkDirectory( 
                ARTICAL_PATH, 
                {followLinks : false}, 
                function( root, fileStats ){
                    walkArticalDirectory(root, fileStats);
                    return true;
                },
                function(){
                    //write response back
                    response.writeHead(200, {'Content-Type' : 'text/json'});
                    response.write(JSON.stringify(allArticalMetaData));
                    response.end();
                }
            );            
        }//end else
    });

}

function walkArticalDirectory(root, fileStats ){
            if ( utils.stringEndWith(fileStats.name, ".md") ){
                //tmp variable
                var meta = {};

                //delte the .md from file name
                meta.title = fileStats.name.slice(0, -3);
                meta.absolutePath = root + '/' + fileStats.name;
                meta.creationDateTime = fs.statSync(meta.absolutePath).mtime.toLocaleDateString('zh-CN');

                allArticalMetaData.metaList.push(meta);

            }

}

/**
* get one artical as html format.
* return data format: {articalHTML: 'xxxxxx'}
* input param format: title=xxxxx
*/
function getArticalAsHTML(request, response){
    //check permission
    authMgmg.isSingin(request, function( err, isSingin ){
        if ( err || ! isSingin ){
            console.log('not signin, redirect to /signin');
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
            request.setEncoding('utf8');

            var clientData = url.parse(request.url).query;
            var clientParam = queryString.parse(clientData);
            console.log(clientParam);
            var path = getAbsolutePathByTitleSync(clientParam.title);
            console.log('read file from path: ' + path);

            var ret = {articalHTML: '', articalMD: ''};
            fs.readFile(path, 'utf8', function( err, data ){
                if ( err ){
                    console.log(err);
                    ret.articalHTML = '<h3>Sorry there are some error in the server...</h3>';
                }else{
                    ret.articalHTML = converter.makeHtml(data);
                    ret.articalMD = data;
                }
                //send back to client
                response.writeHead(200, {'Content-Type' : 'text/json'});
                response.write(JSON.stringify(ret));
                response.end();
            });
        }//end else
    });


}

function newArtical(request, response){
    //check permission
    authMgmg.isSingin(request, function( err, isSingin ){
        if ( err || ! isSingin ){
            console.log('not signin, redirect to /signin');
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
                request.setEncoding("utf8");
                var articalOjb = request.body;
                console.log(articalOjb);
                var filename = ARTICAL_PATH + '/' + articalOjb.title + '.md';
                var artical = articalOjb.artical;
                var backData = {status: 0, error: ''};

                fs.writeFile(filename, artical, {encoding: 'utf8'}, function(err){
                    if ( err ){
                        backData.status = 1;
                        backData.error = err;
                    }else{
                        backData.status = 0;
                        backData.error = '';
                    }

                    //write back
                    response.writeHead(200, {'Content-Type' : 'text/json'});
                    response.write(JSON.stringify(backData));
                    response.end();
                });
        }//end else
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
exports.newArtical = newArtical;
