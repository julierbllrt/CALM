module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });

  var Consultation = require('../models/consultation');

  // get consultations of a doctor
  router.get('/consultation/:id', auth, function (req, res) {
    Consultation.find({doctor: req.params.id})
      .populate({path: 'patient', populate: {path: 'user_id'}})
      .populate('doctor')
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  // add a new consultation
  router.put('/consultation/', auth, function (req, res) {
    var consult = new Consultation();
    consult.doctor = req.body.doctor;
    consult.patient = req.body.patient;
    consult.date = req.body.date;
    consult.motif = req.body.motif;

    console.log(consult);

    consult.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  router.get('/consultation/date/:id/:date', auth, function (req, res) {
    console.log('we are in api dispo date');
    let myDateTab = (req.params.date).split(':');
    let myDate = new Date(myDateTab[2], myDateTab[1] - 1, myDateTab[0], myDateTab[3], myDateTab[4], 0);
    console.log('trying to find the dispo for the date : ' + myDate.toLocaleString());
    Consultation.find({doctor: req.params.id, date: myDate})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  return router;
};
