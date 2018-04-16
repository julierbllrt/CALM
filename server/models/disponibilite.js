/**
 * Created by ISEN on 12/04/2017.
 */
var mongoose = require('mongoose');
var Doctor = require('../models/doctor');

// define the schema
var disponnibiliteSchema = mongoose.Schema({
  doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
  jour: Number,
  mois: Number,
  an: Number,
  disponnibilite: {type: [Date]}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Disponnibilite', disponnibiliteSchema);
