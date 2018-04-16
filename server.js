
// Get dependencies
const express = require('express');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const configDB = require('./server/config/database');
const fs = require('fs');
const hpp = require('hpp');
const helmet = require('helmet');
const csrf = require('csurf');

const port = process.env.PORT || '3000';
var app = express();
var options = {
  key: fs.readFileSync('server/cert/calm-key.pem'),
  cert: fs.readFileSync('server/cert/calm-cert.pem')
};

// Connect to database
mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;
app.use(passport.initialize());

// var morgan = require('morgan');
// var cookieParser = require('cookie-parser');
// const flash = require('connect-flash');
// var session = require('express-session');

// required for passport
// app.use(session({ secret: 'littlesecret' })); // session secret

// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session

// var pass = require('./server/config/passport')(passport);
// var pass = require('./server/config/passport');

// Get our API routes
const api = require('./server/routes/api')(passport);
const treatment = require('./server/routes/treatment')(passport);
const apiAutorisation = require('./server/routes/autorisation')(passport);
const apiConsultation = require('./server/routes/consultation')(passport);
const apiDisponnibilite = require('./server/routes/disponibilite')(passport);
const apiPost = require('./server/routes/post')(passport);
const apiMail = require('./server/routes/mail')(passport);
const apiLog = require('./server/routes/log')(passport);
const autorisation = require('./server/routes/autorisation')(passport);
const rappel = require('./server/routes/rappel')(passport);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
app.use('/api', treatment);
app.use('/api', apiAutorisation);
app.use('/api', apiConsultation);
app.use('/api', apiDisponnibilite);
app.use('/api', apiPost);
app.use('/api', apiMail);
app.use('/api', apiLog);
app.use('/api', autorisation);
app.use('/api', rappel);

// Solutions de securite
app.use(hpp());
app.use(helmet());

// Catch all other routes and return the index file
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
app.set('port', port);

const server = https.createServer(options, app);
server.listen(port, 511, () => console.log(`The server started on the port ${port}`));

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({'message': err.name + ': ' + err.message});
  }
});

var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User = mongoose.model('User');

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true},
function (req, email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err); }
    // Return if user not found in database
    if (!user) {
      return done(null, false, {
        message: 'User not found'
      });
    }
    // Return if password is wrong
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Password is wrong'
      });
    }
    // If credentials are correct, return the user object
    return done(null, user);
  });
}
));
