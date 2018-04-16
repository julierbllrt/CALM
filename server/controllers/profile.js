/**
 * Created by Romain on 06/04/2017.
 */
var mongoose = require('mongoose');
//var User = mongoose.model('User');
var User = require('../models/user');
var Address = mongoose.model('Address');

module.exports.profileRead = function(req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .populate({path: 'address'})
      .exec(function(err, user) {
        res.json(user);
      });
  }

};


