var mongoose = require('mongoose');
var User = require('../models/user');
var Patient = require('../models/patient');
var Address = require('../models/address');
var encrypt = require('mongoose-encryption');

//define the schema
var organisationSchema = mongoose.Schema ({
  user_id: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  name: String,
  email: String,
  phone: String,
  address: {type:mongoose.Schema.Types.ObjectId, ref:'Address'},
  Created_at: {type:Date,default:Date.now}
});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

organisationSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey, excludeFromEncryption: ['user_id', 'address']});

// create the model for users and expose it to our app
module.exports = mongoose.model('Organisation', organisationSchema);
