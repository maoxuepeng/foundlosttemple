
var express = require('express');

// pass the express to the connect redis module
// allowing it to inherit from express.session.Store
//var RedisStore = require('connect-redis')(express);
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();
var app = express();

//app.use(express.favicon());

//product and /home/products are static html, script, jpg files
app.use(express.static(__dirname + '/static'));

//use a sceret key
app.use(express.cookieParser('found lost temple'));
//app.use(express.session( {secret: 'store 4 lucy'} ));
// Populates req.session
app.use(express.session(
    { 
        /*cookie: {
            path: "/",
            httpOnly: true,
            maxAge: null
        },  */      
        key: 'foundlosttemple', 
        secret: 'found lost temple', 
        store: sessionStore })

);
///app.use(express.cookieSession());

//use body parser
app.use( express.bodyParser( /*{uploadDir: __dirname + '/uploads'}*/ ) );

var utils = require('./utils');

//auth management
var authMgmt = require('./usermgmt/auth_question');
var articalMgmt = require('./articalmgmt/articalmgmt');

//home page
app.get('/', function(request, response){
    console.log('request the root path');

    authMgmt.isSingin(request, function( err, isSignin ){
        if ( err || ! isSignin ){
            response.writeHead(302, {'Location' : '/signin'});
            response.end();
        }else{
            console.log('go to home page');
            utils.writeHTML2Client(__dirname + '/static/20434/index.html', response);
        }
    });
} );

app.post('/auth', authMgmt.signin);
app.get('/signin', function(request, response){
    utils.writeHTML2Client(__dirname + '/static/20434/signin.html', response);
} );
app.get('/artical', function(request, response){
    utils.writeHTML2Client(__dirname + '/static/20434/artical_content.html', response);
});
app.get('/artical/meta', articalMgmt.getAllArticalMetaData);
app.get('/artical/content', articalMgmt.getArticalAsHTML);


app.listen(80);

console.log("app listening on port 80.");