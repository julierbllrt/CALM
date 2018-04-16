/**
 * Created by ISEN on 11/04/2017.
 */
var mongoose = require('mongoose');
var Patient = require('../models/patient');
var Doctor = require('../models/doctor');

// define the schema
var consultationSchema = mongoose.Schema({
  patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
  doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
  motif: String,
  date: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Consultation', consultationSchema);
