/**
 * Created by Pierre on 13/11/17
 */

var mongoose = require('mongoose');

//define the schema
var treatmentSchema = mongoose.Schema ({
  userId : String,
  codeCIS : String,
  name: String,
  takingState : {type:String, enum:['','Avant le repas','Pendant le repas','Apres le repas','A jeun','Avant dormir','Au reveil']},
  quantity: Number,
  frequence : Number,
  typeFrequence : {type:String, enum:['','heure','jour','semaine','mois','année']},
  info : String,
  start: Date,
  end: Date,
  expired: Boolean,
  substances: {type: String},
  doctor : {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'}
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Treatment', treatmentSchema);
