module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });

  var Log = require('../models/log');

  // to determine the IP address of the client
  var getIP = require('ipware')().get_ip;

  // add a new log
  router.post('/log', auth, function (req, res) {
    // to test with a real server : not local
    var ip = getIP(req).clientIp;

    var log = new Log();
    log.user = req.body.user;
    log.action = req.body.action;
    log.severity = req.body.severity;
    log.ipAddress = ip;

    log.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  return router;
};
