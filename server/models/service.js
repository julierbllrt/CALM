var mongoose = require('mongoose');
var User = require('../models/user');
var Patient = require('../models/patient');

// define the schema
var serviceSchema = mongoose.Schema({
  doctor_associated: {type: [mongoose.Schema.Types.ObjectId], ref: 'Doctor'},
  phone: String,
  name: String,
  email: String,
  Created_at: {type: Date, default: Date.now}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Service', serviceSchema);
