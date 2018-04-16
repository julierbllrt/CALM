/**
 * Created by ISEN on 11/04/2017.
 */
var mongoose = require('mongoose');
var User = require('../models/user');
var Patient = require('../models/patient');
var Building = require('./building');

// define the schema
var doctorSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  phone: String,
  infrastructure: {type: [mongoose.Schema.Types.ObjectId], ref: 'Building'},
  patients: {type: [mongoose.Schema.Types.ObjectId], ref: 'Patient'}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Doctor', doctorSchema);
