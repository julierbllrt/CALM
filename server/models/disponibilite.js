var mongoose = require('mongoose');
var Doctor = require('../models/doctor');
var encrypt = require('mongoose-encryption');

//define the schema
var disponnibiliteSchema = mongoose.Schema ({
  doctor : {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
  jour: Number,
  mois: Number,
  an: Number,
  disponnibilite: {type: [Date]}
});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

disponnibiliteSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey, excludeFromEncryption: ['doctor']});

// create the model for users and expose it to our app
module.exports = mongoose.model('Disponnibilite', disponnibiliteSchema);
