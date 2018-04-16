/**
 * Created by Romain on 06/04/2017.
 */
// load all the things we need
var passport   = require('passport');
// load up the user model
var mongoose = require('mongoose');
var User = mongoose.model('User');
//var Address = mongoose.model('Address');
var Address = require('../models/address');
var Doctor = require('../models/doctor');
var Patient = require('../models/patient');
var Building = require('../models/building');
var logger = require('../config/logger');
var fs = require('fs');
var https = require('https');


function verifyRecaptcha(key, callback){
  var SECRET = "6Le2J08UAAAAANx-dc0SFiaDF5NJvPBrZmJShhNT";
  https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk.toString();
    });
    res.on('end', function() {
      try {
        var parsedData = JSON.parse(data);
        console.log(parsedData);
        callback(parsedData.success);
      } catch (e) {
        console.log(e);
        callback(false);
      }
    });
  });
}


module.exports.register = function(req, res) {
  var address = new Address();
  //user.profile_img.data = fs.readFileSync(req.body.profile_img.data);
  //user.profile_img.contentType = req.body.contentType;
  address.country = req.body[0].address.country;
  address.city = req.body[0].address.city;
  address.street_address = req.body[0].address.street_address;
  address.num = req.body[0].address.num;
  address.latitude = req.body[0].address.latitude;
  address.longitude = req.body[0].address.longitude;

  //Create address
  address.save(function(err) {
  });

  // console.log("req.body : ", req.body);
  var user = new User(); // Important : create the _id of the user
  user.first_name = req.body[0].first_name;
  user.last_name = req.body[0].last_name;
  user.email = req.body[0].email;
  user.password = user.generateHash(req.body[0].password);
  user.birth_date = req.body[0].birth_date;
  user.role = ['patient',req.body[0].role];
  user.address = new Address(address);


  // Verify that the email is not already used
  User.findOne({email:user.email} ,function (err, newUser) {
    if (err) return (err);
    if (newUser) {
      res.status(409);
    }
    else {
      verifyRecaptcha(req.body[1], function (success) {
        if (success) {

          user.save(function (err) {
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
              "token": token
            });
          });

          switch (req.body[0].role) {
            case "medecin":
              var doctor = new Doctor({user_id: user._id});
              var patient = new Patient({user_id: user._id});
              doctor.save(function (err) {
              });
              patient.save(function (err) {
              });
              break;
            case "patient":
              var patient = new Patient({user_id: user._id});
              patient.save(function (err) {
              });
              break;
            case "building":
              var building = new Building({user_id: user._id});
              building.save(function (err) {
              });
            default:
              console.log("Default case");
              break;
          }
          logger.info('New user registered :' + user._id);
        } else {
          res.json({"response": "Failed"});
          //logger.info('User tried to register without captcha or failed it');
        }
      });
    }
  });
};

module.exports.login = function(req, res) {
  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return "400";
  }
  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
      logger.info('User connected :' + user._id);
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

