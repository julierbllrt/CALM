
// Get dependencies
const express = require('express');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const configDB = require('./server/config/database');
const fs = require('fs');

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

// Catch all other routes and return the index file
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

https
  .createServer(options, app)
  .listen(port,
    () => console.log(`The server is running on the port ${port}`));

// [SH] Catch unauthorised errors
app.use((err, res) => {
  if (err.name === 'UnauthorizedError') { res.status(401).json({'message': err.name + ': ' + err.message}); }
});

const {Strategy} = require('passport-local');
// load up the user model
const User = mongoose.model('User');
let optionsCredentials = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
};

/**
 * Permet d'authentifier l'utilisateur par rapport a ses identifiants
 * !!! ne pas supprimer le paramètre 'req' (request) !!!
 * c'est ce qui permet d'envoyer la demande de vérification :-)
 */
passport.use('local',
  new Strategy(optionsCredentials,
    (req, email, password, done) => {
      User.findOne({ email: email },
        (err, user) => {
          if (err) { return done(err); }
          if (!user) { return done(null, false, { message: 'User not found' }); }
          if (!user.validPassword(password)) { return done(null, false, { message: 'Password is wrong' }); }
          return done(null, user); // If credentials are correct, return the user object
        }
      );
    }
  )
);
