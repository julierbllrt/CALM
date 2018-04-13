var mongoose = require('mongoose');
var Patient = require('../models/patient');
var Doctor = require('../models/doctor');
var encrypt = require('mongoose-encryption');

var diseaseSchema = mongoose.Schema({
  patient: {type:mongoose.Schema.Types.ObjectId, ref:'Patient'},
  doctor: {type:mongoose.Schema.Types.ObjectId, ref:'Doctor'},
  name: String,
  severity: Number,
  comments: String,
  Created_at: {type:Date, default:Date.now}
});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

diseaseSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey});

module.exports = mongoose.model('Disease',diseaseSchema);
