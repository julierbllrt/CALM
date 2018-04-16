/**
 * Created by Romain on 28/03/2017.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var Address = require('../models/address');

// define the schema
var userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  birth_date: Date,
  email: String,
  password: String,
  role: [String],
  profile_img: { data: Buffer, contentType: String },
  address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'}
});

// generating a password
userSchema.methods.generateHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

// checking if password is valid
userSchema.methods.validPassword = (password) => bcrypt.compareSync(password, this.password);

// generating a token
userSchema.methods.generateJwt = () => {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  var payload = {
    _id: this._id,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000)
  };

  var token = jwt.sign(payload, 'CALM_SECRET'); // DO NOT KEEP YOUR SECRET IN THE CODE!

  return token;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
