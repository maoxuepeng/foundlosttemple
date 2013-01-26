//define all request handles
var fs = require("fs");

//the home path handle. In this handle, check the cookies if user already singed in, then to home page else to sign in page
function home(request, response, pathname, params){
    console.log('home handle executed.');
    writeHTTPHead(response, 200, "text/plain");

    response.write("empty in home process.");
    response.end();
}

//The team page, this request with team id parameter
function team(request, response, pathname, params){
    console.log('team handle executed.');
    writeHTTPHead(response, 200, "text/html");
    fs.readFile("html/team.html", "utf-8", function(err, data){
        if (err){
            console.log(err);
        }else{
            response.write(data);
            response.end();
        }
    });
   }

function defaultHandle(request, response, pathname, params){

    if (stringEndWith(pathname, ".css")){
        writeHTTPHead(response, 200, "text/css");
        writeFile2Respond(pathname, response);
    }else if (stringEndWith(pathname, ".jpg")){
        writeHTTPHead(response, 200, "image/jpg");
        writeFile2Respond(pathname, response);
    }else if (stringEndWith(pathname, ".js")){
        writeHTTPHead(response, 200, "text/javascript");
        writeFile2Respond(pathname, response);
    }else{
        console.log("no found handle for " + pathname);
    }

}

function writeFile2Respond(pathname, response){
    var content = fs.readFileSync(process.cwd() + pathname);
    response.write(content);
    response.end();

}


function writeHTTPHead(response, status, contentType){
    response.writeHead(status, {"Content-Type" : contentType});
}

function stringEndWith(src, suffix){
    return src.indexOf(suffix, src.length - suffix.length) !== -1;
}


exports.home = home;
exports.team = team;
exports.defaultHandle = defaultHandle;