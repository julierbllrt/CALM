/**
 * Created by Romain on 22/03/2017.
 */
// Get dependencies
const express = require('express');
const path = require('path');
const https = require('https');

var mongoose = require('mongoose');
var configDB = require('./server/config/database');
var passport = require('passport');
var flash = require('connect-flash');
const app = express();

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');

// Connect to database
mongoose.connect(configDB.url);

// required for passport
// app.use(session({ secret: 'littlesecret' })); // session secret
app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session


// var pass = require('./server/config/passport')(passport);
var pass = require('./server/config/passport');

// Get our API routes
const api = require('./server/routes/api')(passport);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Certificat for https server
 * */
var fs = require('fs');
var hskey = fs.readFileSync('server/cert/calm-key.pem');
var hscert = fs.readFileSync('server/cert/calm-cert.pem');
var options = {
  key: hskey,
  cert: hscert
};

/**
 * Create HTTPS server.
 */
const server = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
