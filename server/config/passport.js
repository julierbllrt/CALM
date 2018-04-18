/**
 * Created by Romain on 03/04/2017.
 */
// load all the things we need
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var User = require('../models/user');
var logger = require('../config/logger');

passport.use('local',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback : true},
  function(req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err); }
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



