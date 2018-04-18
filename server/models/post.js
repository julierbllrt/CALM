                                                    /**
 * Created by Romain on 22/04/2017.
 */
var mongoose = require('mongoose');
var User = require('../models/user');
var encrypt = require('mongoose-encryption');

//define the schema
var postSchema = mongoose.Schema ({
  sender : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  receiver : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  text : String,
  Created_at: {type:Date,default:Date.now},
  type: {type:String, enum:['INFO','ALERT','POST','TREATMENT']}
});

var encKey = process.env.ENCKEY;
var signKey = process.env.SIGNKEY;

postSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: signKey, excludeFromEncryption: ['sender', 'receiver']});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
