var mongoose = require('mongoose');
var User = require('../models/user');
var Patient = require('../models/patient');
var Address = require('../models/address');

// define the schema
var organisationSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  email: String,
  phone: String,
  address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  Created_at: {type: Date, default: Date.now}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Organisation', organisationSchema);
