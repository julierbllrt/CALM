/**
 * Created by Pierre on 13/11/17
 */

var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// define the schema
var treatmentSchema = mongoose.Schema({
  userId: String,
  codeCIS: String,
  name: String,
  takingState: {type: String, enum: ['', 'Avant-repas', 'Pendant-repas', 'Apres-repas', 'A-jeun', 'Avant-dormir', 'Au-reveil']},
  quantity: Number,
  frequence: Number,
  typeFrequence: {type: String, enum: ['', 'heures', 'jours', 'semaines', 'mois', 'annees']},
  info: String,
  start: Date,
  end: Date,
  expired: Boolean,
  substances: {type: String},
  doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'}
});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

treatmentSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey, excludeFromEncryption: ['doctor', 'userId', 'codeCIS', 'expired']});

// create the model for users and expose it to our app
module.exports = mongoose.model('Treatment', treatmentSchema);
