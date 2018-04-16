/**
 * Created by Romain on 06/04/2017.
 * Updated by Xavier on 16/04/2018
 */
const passport = require('passport');
const mongoose = require('mongoose');

// var Address = mongoose.model('Address');
var Address = require('../models/address');
var Doctor = require('../models/doctor');
var Patient = require('../models/patient');
var Building = require('../models/building');

var User = mongoose.model('User');

module.exports.register = function (req, res) {
  var address = new Address();
  // user.profile_img.contentType = req.body.contentType;
  address.country = req.body.address.country;
  address.city = req.body.address.city;
  address.street_address = req.body.address.street_address;
  address.num = req.body.address.num;
  address.latitude = req.body.address.latitude;
  address.longitude = req.body.address.longitude;

  // Create address
  address.save(err => {});

  // console.log("req.body : ", req.body);
  var user = new User(); // Important : create the _id of the user
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.email = req.body.email;
  user.password = user.generateHash(req.body.password);
  user.birth_date = req.body.birth_date;
  user.role = ['patient', req.body.role];
  user.address = new Address(address);

  // Verify that the email is not already used
  User.findOne({email: user.email}, (err, newUser) => {
    if (err) return (err);
    if (newUser) {
      res.status(409);
    } else {
      user.save(() => {
        let token = user.generateJwt();
        res.status(200).json({ 'token': token });
      });

      switch (req.body.role) {
        case 'medecin':
          var doctor = new Doctor({user_id: user._id});
          var patient = new Patient({user_id: user._id});
          doctor.save(err => {});
          patient.save(err => {});
          break;
        case 'patient':
          var patientUn = new Patient({user_id: user._id});
          patientUn.save(err => {});
          break;
        case 'building':
          var building = new Building({user_id: user._id});
          building.save(err => {});
          console.log('Default case');
          break;
      }
    }
  });
};

module.exports.login = function (req, res) {
  if (!req.body.email || !req.body.password) {
    return res.json(401, {err: 'email and password required'});
    // sendJSONresponse(res, 400, {
    //   'message': 'All fields required'
    // });
    // return '400';
  }
  passport.authenticate('local', function (err, user, info) {
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200).json({ 'token': token });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};
