module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });

  var Disponnibilite = require('../models/disponibilite');

  router.get('/disponnibilite/doctor/:id', auth, function (req, res) {
    Disponnibilite.find({doctor: req.params.id})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  router.get('/disponnibilite/:id', auth, function (req, res) {
    Disponnibilite.find({_id: req.params.id})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  router.put('/disponnibilite/', auth, function (req, res) {
    var dispo = new Disponnibilite();
    dispo.doctor = req.body.doctor;
    dispo.disponnibilite = req.body.disponnibilite;
    dispo.jour = req.body.jour;
    dispo.mois = req.body.mois;
    dispo.an = req.body.an;

    dispo.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  router.post('/disponnibilite/', auth, function (req, res) {
    console.log('modify dispo');
    Disponnibilite.findByIdAndUpdate(req.body._id, {$set: {disponnibilite: req.body.disponnibilite}}, { new: true }, function (err, dispo) {
      if (err) {
        return handleError(err);
      }
      if (dispo) {
        res.sendStatus(200);
      }
    });
  });

  router.get('/disponnibilite/date/:id/:date', auth, function (req, res) {
    console.log('we are in api dispo date');
    let myDateTab = (req.params.date).split(':');
    let myDate = new Date(myDateTab[2], myDateTab[1] - 1, myDateTab[0], myDateTab[3], myDateTab[4], 0);
    console.log('trying to find the dispo for the date : ' + myDate.toLocaleString());
    Disponnibilite.find({doctor: req.params.id, jour: myDate.getDate(), mois: (myDate.getMonth() + 1), an: myDate.getFullYear()})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  return router;
};
