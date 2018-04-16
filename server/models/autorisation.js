var mongoose = require('mongoose');
var User = require('../models/user');
var encrypt = require('mongoose-encryption');

var autorisationSchema = mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  observer : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  type : String,
  subject : String,
  Created_at: {type:Date,default:Date.now},
  valide : {type:Boolean,default:true},
  confirm : {type:Boolean, default: false}

});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

autorisationSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey, excludeFromEncryption: ['user', 'observer']});

module.exports = mongoose.model('Autorisation',autorisationSchema);
