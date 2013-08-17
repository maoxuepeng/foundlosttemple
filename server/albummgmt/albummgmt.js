var fs = require('fs');

var ALBUM_ROOT = process.cwd() + '/server/data/public/protected/';
var authMgmt = require('../usermgmt/auth_question');



/**
* Get all albums in the team folder.
* e.g get all albums in the team 20434
*/
function getAlbumMeta(request, response){
    //check permission
    authMgmt.isSingin(request, function( err, isSingin ){
        if ( err || ! isSingin ){
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
            var result = {status: 0, error: '', albumNameList: []};
            var teamName = request.session.currentTeam;
            response.writeHead(200, {'Content-Type' : 'text/json'});

            //if teamName is empty, write error to client
            if ( ! teamName || teamName == '' ){
                result.status = 1;
                result.error = 'no team name found.';
                response.write(JSON.stringify(result));
                response.end();
            }else{
                var rootpath = ALBUM_ROOT + teamName;
                fs.readdir(rootpath, function(err, files){
                    //if file is directory, save and to be send to client
                    if ( err ){
                        result.status = 2;
                        result.error = err;
                        response.write(JSON.stringify(result));
                        response.end();
                    }else{
                        for( var i = 0; i < files.length; i++ ){
                            var path = rootpath + '/' + files[i];
                            if ( fs.statSync(path).isDirectory() ){
                                //client only need the name for the album name, not the absolute path
                                result.albumNameList.push(files[i]);
                            }
                        }
                        response.write(JSON.stringify(result));
                        response.end();
                    }
                });//end fs.readdir
            }//end if ( ! teamName || teamName == '' )

        }//end if ( err || ! isSingin )
    });
}

function createAlbum(request, response){
    authMgmt.isSingin(request, function( err, isSingin ){
        if ( err || !isSingin ){
            console.log('not signin, redirect');
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
            request.setEncoding("utf8");
            console.log(request.body);
            var album = request.body;
            var result = {status: 0, error: ''};

            var teamName = request.session.currentTeam;
            response.writeHead(200, {'Content-Type' : 'text/json'});
            if ( ! teamName || teamName == '' ){
                result.status = 1;
                result.error = 'no team name found.';
                response.write(JSON.stringify(result));
                response.end();
            }else{
                var rootpath = ALBUM_ROOT + teamName + '/' + album.newAlbumName;
                fs.exists(rootpath, function(exists){
                    if ( exists ){
                        result.status = 2;
                        result.error = 'album(' + album.newAlbumName + ') already exist.';
                        response.write(JSON.stringify(result));
                        response.end();
                    }else{
                        fs.mkdir(rootpath, function(error){
                            if ( error ){
                                result.status = 3;
                                result.error = error;
                            }
                            response.write(JSON.stringify(result));
                            response.end();                                              

                        });//end fs.mkdir                                        
                    }//end if exist
                });//end fs.exists

            }
        }//end if isSingin
      
    } );//end isSingin

 
}

exports.getAlbumMeta = getAlbumMeta;
exports.createAlbum = createAlbum;