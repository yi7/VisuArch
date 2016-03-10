// server.js

// BASE SETUP
// =============================================================================
// call the packages we need
var express         = require('express'); // call express
var app             = express(); // define our app using express
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');

// connect to our database
var database = require('./config/database');
mongoose.connect(database.url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000; // set our port

// get an instance of the express Router
var router = express.Router();
require('./app/routes/MainRoute')(router);
require('./app/routes/MongoRoute')(router);
require('./app/routes/FireRoute')(router);

// all our routes will be prefixed with /api
app.use('/api', router);

// refreshed page will go through index.html first
app.all('/*', function(req, res, next) {
    res.sendFile('public/index.html', { root: __dirname });
});

app.listen(port);
console.log('App listening on port: ' + port);

exports = module.exports = app;
