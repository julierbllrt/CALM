/**
 * Created by ISEN on 12/04/2017.
 */
var mongoose = require('mongoose');

var Doctor = require('../models/doctor');
var Address = require('../models/address');
var Service = require('../models/service');
var User = require('../models/user');

// define the schema
var buildingSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  doctor_associated: {type: [mongoose.Schema.Types.ObjectId], ref: 'Doctor'},
  address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  phone: String,
  name: String,
  email: String,
  services: {type: [mongoose.Schema.Types.ObjectId], ref: 'Service'},
  Created_at: {type: Date, default: Date.now}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Building', buildingSchema);
