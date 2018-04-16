/**
 * Created by ISEN on 12/04/2017.
 */
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

//define the schema
var addressSchema = new mongoose.Schema ({
  num : Number,
  street_address : String,
  city : String,
  postal_code : Number,
  country : String,
  latitude : Number,
  longitude : Number,
  precision : Boolean
});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

addressSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey});

// create the model for users and expose it to our app
module.exports = mongoose.model('Address', addressSchema);
