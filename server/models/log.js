
var mongoose = require('mongoose');
var User = require('../models/user');

// define the schema
var logSchema = mongoose.Schema({
  action: String,
  severity: {type: Number, enum: [1, 2, 3, 4, 5]},
  ipAddress: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Log', logSchema);
