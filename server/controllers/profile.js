/**
 * Created by Romain on 06/04/2017.
 * Updated by Xavier on 16/04/2018
 */
const mongoose = require('mongoose');
// var User = mongoose.model('User');
var User = require('../models/user');
var Address = mongoose.model('Address');

module.exports.profileRead = function (req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      'message': 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .populate({path: 'address'})
      .exec(function (err, user) {
        if (err) { res.json(err); } else { res.json(user); }
      });
  }
};
