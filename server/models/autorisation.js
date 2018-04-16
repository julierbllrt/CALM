/**
 * Created by ISEN on 12/04/2017.
 */
var mongoose = require('mongoose');
var User = require('../models/user');

var autorisationSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  observer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  type: String,
  subject: String,
  Created_at: {type: Date, default: Date.now},
  valide: {type: Boolean, default: true},
  confirm: {type: Boolean, default: false}

});

module.exports = mongoose.model('Autorisation', autorisationSchema);
