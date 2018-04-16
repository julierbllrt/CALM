/**
 * Created by ISEN on 12/04/2017.
 */
var mongoose = require('mongoose');
var Patient = require('../models/patient');
var Doctor = require('../models/doctor');

var diseaseSchema = mongoose.Schema({
  patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
  doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
  name: String,
  severity: Number,
  comments: String,
  Created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Disease', diseaseSchema);
