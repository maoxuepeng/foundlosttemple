var fs = require('fs');

var USER_FILE_PATH = process.cwd() + "/server/data/user";

/**
* @method find user object by user email
* @param string, the user email
**/
function findUserByEmail(email, callback){
    fs.readFile(USER_FILE_PATH, "utf8", function (err, data){
        if ( err ){
            callback(err, null);
        }else{
            var users = JSON.parse(data);
            var targetUser = users[email];
            if ( targetUser ){
                callback(null, targetUser);
            }else{
                callback("user for email[" + email + "] can not found.", null);
            }

        }
    });

} 


/**
* @method find user object by user name
* @param string, the user name
**/
function findUserByName(name, callback){
    fs.readFile(USER_FILE_PATH, "utf8", function (err, data){
        if ( err ){
            callback(err, null);
        }else{
            console.log("users = " + data)
            var users = JSON.parse(data);
            var targetUser = users[name];
            if ( targetUser ){
                callback(null, targetUser);
            }else{
                callback("user for name[" + name + "] can not found.", null);
            }

        }
    });

} 

/**
* @method update the user to the user file, if user exist then update else save to a new one
* @param object user object
**/
function updateUser(user, callback){
    fs.readFile(USER_FILE_PATH, "utf8", function(err, data){
        if ( err ){
            callback(err, null);
        }else{
            var users = JSON.parse(users);

            //try to find exist user
            var exist = -1;
            for ( var i = 0; i < users.length; i++ ){
                if (users[i].email == user.email){
                    exist = i;
                    break;
                }
            }

            //if use exist then update, else add a new one
            if ( exist != -1 ){
                users[exist] = user;
            }else{
                users.push(user);
            }

            //save to file
            fs.writeFile(USER_FILE_PATH, JSON.stringify(users), "utf8", function(err){
                if ( err ){
                    callback(err, null);
                }else{
                    callback(null, user);
                }
            });

        }
    });

}

function isAdminRole( username, callback){
    if ( ! username ){
        return callback( null, false );
    }

    findUserByName( username, function( err, user ){
        if ( err ){
            callback( err, null );
        }else{
            if ( user.role.indexOf('admin') != -1 ){
                callback( null, true );
            }else{
                callback( null, false );
            }
        }
    } );

} 

exports.findUserByEmail = findUserByEmail;
exports.updateUser = updateUser;
exports.isAdminRole = isAdminRole;