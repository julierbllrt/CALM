/**
 * Created by ISEN on 12/04/2017.
 */
var mongoose = require('mongoose');

// define the schema
var addressSchema = mongoose.Schema({
  num: Number,
  street_address: String,
  city: String,
  postal_code: Number,
  country: String,
  latitude: Number,
  longitude: Number,
  precision: Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Address', addressSchema);
