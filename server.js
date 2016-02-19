// server.js

// BASE SETUP
// =============================================================================
// call the packages we need
var express    = require('express'); // call express
var app        = express(); // define our app using express
var path       = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

// connect to our database
var database = require('./config/database');
mongoose.connect(database.url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port

// get an instance of the express Router
var router = express.Router();
require('./app/routes/taxi.route')(router);


// REGISTER OUR ROUTES
// =============================================================================
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
// viewed at https://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port);
console.log('App listening on port: ' + port);
