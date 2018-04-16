/**
 * Created by hongchang on 2/11/2017.
 */
var mongoose = require('mongoose');

// define the schema
var reminderSchema = mongoose.Schema({
  userId: String,
  rappel: {
    name: String,
    quantity: String,
    takingState: String,
    frequence: String,
    typeFrequence: String,
    info: String
  },
  traitementId: String,
  date: String,
  time: String,
  expire: Boolean

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Reminder', reminderSchema);
