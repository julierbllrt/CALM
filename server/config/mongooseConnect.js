const mongoose = require('mongoose');

module.exports.connect = function (mongoUri, promiseLib) {
  // mongoUri should be in the form of "mongodb://user:pass@url:port/dbname"

  promiseLib = promiseLib || global.Promise;

  // mongoose' Promise library is deprecated, so we need to provide our own.
  mongoose.Promise = promiseLib;
  var mongoDB = mongoose.connect(mongoUri, {
    promiseLibrary: promiseLib // Deprecation issue again
  });

  mongoDB
    .then(db => {
      console.log('The database Mongodb has been connected successfully.');
    })
    .catch(err => {
      console.log('Error while trying to connect with the database Mongodb');
      throw err;
    });

  // Even though it's a promise, no need to worry about creating models immediately, as mongoose buffers requests until a connection is made

  return mongoDB;
};
