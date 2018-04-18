/**
 * Created by Neko on 21/11/2017
 */

module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });
  const DATETRANSLATION = {
    'Avant-repas': ['11:00', '19:00'],
    'Pendant-repas': ['12:00', '20:00'],
    'Apres-repas': ['13:00', '21:00'],
    'A-jeun': ['7:00'],
    'Avant-dormir': ['22:00'],
    'Au-reveil': ['6:30']
  };
  var Reminder = require('../models/reminder');
  var Treatment = require('../models/treatment');

  function createFirstRappel (treatment, res) {
    var start = new Date();
    start = start.toString();
    console.log(start);
    console.log(treatment);
    start = new Date(start);
    var rappel = {
      name: '',
      quantity: '',
      takingState: '',
      frequence: '',
      typeFrequence: '',
      info: ''
    };
    rappel.name = treatment.name;
    rappel.quantity = treatment.quantity;
    rappel.takingState = treatment.takingState;
    rappel.frequence = treatment.frequence;
    rappel.typeFrequence = treatment.typeFrequence;
    rappel.info = treatment.info;
    start = start.getDate() + '-' + (start.getMonth() + 1) + '-' + start.getFullYear();
    new Reminder({
      userId: treatment.userId,
      rappel: rappel,
      traitementId: treatment._id,
      time: DATETRANSLATION[treatment.takingState],
      date: start,
      expire: false
    }).save().then(function (content) {
      res.json(content);
    });
  }

  // get Treatment for a specific patient
  router.get('/treatment/:id', auth, function (req, res) {
    Treatment
      .find({userId: req.params.id, expired: false})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  router.put('/treatment/:id', auth, function (req, res, next) {
    var treatment = new Treatment();
    treatment.userId = req.params.id;
    treatment.codeCIS = req.body.codeCIS;
    treatment.name = req.body.name;
    treatment.info = req.body.info;
    treatment.typeFrequence = req.body.typeFrequence;
    treatment.frequence = req.body.frequence;
    treatment.quantity = req.body.quantity;
    treatment.takingState = req.body.takingState;
    treatment.start = req.body.start;
    treatment.end = req.body.end;
    treatment.substances = [];
    treatment.expired = false;

    treatment.save(function (err, response) {
      if (err) {
        console.log('update traitement failed');
        res.json(err);
      }
      console.log('going to create first rappel');
      createFirstRappel(response, res);
    });
  });

  router.put('/updateTreatment/:id', auth, function (req, res, next) {
    console.log('update treatment ' + req.params.id);
    Treatment.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        end: req.body.end,
        takingState: req.body.takingState,
        quantity: req.body.quantity,
        frequence: req.body.frequence,
        typeFrequence: req.body.typeFrequence,
        info: req.body.info,
        expired: req.body.expired
      }
    }, {new: true}, function (err, response) {
      if (err) {
        res.json(err);
      }
      if (response) {
        var start1 = new Date();
        start1 = start1.toString();
        start1 = new Date(start1);
        var rappel = {
          name: '',
          quantity: '',
          takingState: '',
          frequence: '',
          typeFrequence: '',
          info: ''
        };
        rappel.name = response.name;
        rappel.quantity = response.quantity;
        rappel.takingState = response.takingState;
        rappel.frequence = response.frequence;
        rappel.typeFrequence = response.typeFrequence;
        rappel.info = response.info;
        start1 = start1.getDate() + '-' + (start1.getMonth() + 1) + '-' + start1.getFullYear();
        Reminder.update({
          traitementId: req.params.id
        }, {
          time: DATETRANSLATION[rappel.takingState][0],
          date: start1,
          rappel: rappel
        }).exec(function (err, docs) {
          console.log('erro info' + err);
          res.json(docs);
        });
      }
    });
  });

  router.delete('/treatment/:id', auth, function (req, res, next) {
    Treatment.remove({_id: req.params.id}, function (err, docs) {
      if (!err && docs) { res.json(docs); } else { res.json(err); }
    });
  });

  router.get('/getMedicName/:medic', auth, function (req, res, next) {
    var request = require('request');
    request('https://open-medicaments.fr/api/v1/medicaments?query=' + req.params.medic, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.json(body);
      }
    });

    // res.json('https://open-medicaments.fr/api/v1/medicaments?query=doliprane');
  });

  router.get('/getMedicInfo/:codeCIS', auth, function (req, res, next) {
    var request = require('request');
    request('https://open-medicaments.fr/api/v1/medicaments/' + req.params.codeCIS, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.json(body);
      }
    });

    // res.json('https://open-medicaments.fr/api/v1/medicaments?query=doliprane');
  });

  router.get('/getMedicInteraction/:ids', auth, function (req, res, next) {
    var request = require('request');
    request('https://open-medicaments.fr/api/v1/interactions/?ids=' + req.params.ids, function (error, response, body) {
      res.json(body);
    });
  });

  return router;
};
