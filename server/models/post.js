/**
 * Created by Romain on 22/04/2017.
 */
var mongoose = require('mongoose');
var User = require('../models/user');

// define the schema
var postSchema = mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  Created_at: {type: Date, default: Date.now},
  type: {type: String, enum: ['INFO', 'ALERT', 'POST', 'TREATMENT']}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
