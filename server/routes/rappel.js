module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });
  var Treatment = require('../models/treatment');
  var Reminder = require('../models/reminder');

  const DATETRANSLATION = {
    'Avant-repas': ['11:00', '19:00'],
    'Pendant-repas': ['12:00', '20:00'],
    'Apres-repas': ['13:00', '21:00'],
    'A-jeun': ['7:00'],
    'Avant-dormir': ['22:00'],
    'Au-reveil': ['6:30']
  };
  const TYPEFREQUENCETRANSLATION = {
    'jours': 1,
    'semaines': 7,
    'mois': 30,
    'annees': 365
  };
  // Get rappels by the userID
  router.get('/getRappels/:userId', auth, function (req, res, next) {
  // console.log(req.params.userId);
    Reminder.find({
      userId: req.params.userId,
      expire: 'false'
    }).sort({_id: -1})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  router.get('/reminderDone/:reminderId', auth, function (req, res, next) {
  // console.log("i ma here");
    Reminder.update({
      _id: req.params.reminderId
    }, {
      expire: 'True'
    }).exec(function (err, docs) {
      if (err) {
        res.json('reminder done failed');
      } else {
        Reminder.find({
          _id: req.params.reminderId
        }).exec(function (err, docs) {
          if (err) {
            res.json('reminder done failed');
          } else {
          // console.log('going to create next rappel');
          // console.log(docs);
          // console.log(docs[0]);
            createNextRappel(docs[0]);
            // console.log('after create next rappel');
            res.json('create new rappel');
          }
        });
      }
    });
  });

  router.put('/createFirstRappel/', auth, function (req, res, next) {
    var treatment = req.body;
    var start = new Date();
    start = start.toString();
    // console.log(start);
    // console.log(treatment);
    start = new Date(start);
    var rappel = {
      name: '',
      quantity: '',
      takingState: '',
      frequence: '',
      typeFrequence: '',
      info: ''
    };
    rappel.name = req.body.name;
    rappel.quantity = req.body.quantity;
    rappel.takingState = req.body.takingState;
    rappel.frequence = req.body.frequence;
    rappel.typeFrequence = req.body.typeFrequence;
    rappel.info = req.body.info;
    start = start.getDate() + '-' + (start.getMonth() + 1) + '-' + start.getFullYear();
    // console.log(rappel);
    new Reminder({
      userId: req.body.userId,
      rappel: rappel,
      traitementId: req.body._id,
      date: start,
      expire: false
    }).save().then(function (content) {
      res.json(content);
    });
  // console.log(treatment.quantity);
  });

  router.put('/createNextRappel/', auth, function (req, res, next) {
    var treatment = req.body;
    new Reminder({
      userId: req.body.userId,
      rappel: req.body.info,
      traitementId: req.body._id,
      date: new Date(),
      expire: false
    }).save().then(function (content) {
      res.json(content);
    });
    // console.log(treatment.quantity);
    res.json(treatment);
  });

  router.put('/testapi/', auth, function (req, res, next) {
    if (createNextRappel()) {
      res.json('succeed in creating next rappel');
    } else {
      res.json('false create next rappel');
    }
  });

  function createNextRappel (rappel) {
  // .find({})
  // .populate('doctor')
  // .populate('patient')
  // .exec(function (err, docs) {
  //   res.json(docs);
  // });
  // console.log('in createrappel function'+rappel);
  // console.log(typeof rappel);
    var treatment = null;
    Treatment.find({_id: rappel.traitementId}).exec(function (err, docs) {
      if (err) {
        res.json(' create next rappel failed');
      } else {
      // console.log(docs);
        treatment = docs[0];
        var today = new Date();
        var endday = new Date(treatment.end);
        // console.log(treatment.typeFrequence);
        // console.log(TYPEFREQUENCETRANSLATION[treatment.typeFrequence]);
        var nextDay = today.setDate(today.getDate() + TYPEFREQUENCETRANSLATION[treatment.typeFrequence]);
        // console.log(nextDay);
        if (valideDate(nextDay, endday)) {
          var year = new Date(nextDay).getFullYear();
          var month = new Date(nextDay).getMonth();
          var day = new Date(nextDay).getDate();
          var newNextDay = new Date(year, month, day);
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
          // console.log(DATETRANSLATION[treatment.takingState][0]);
          for (var i = 0; i < rappel.frequence; i++) {
            new Reminder({
              userId: treatment.userId,
              rappel: rappel,
              traitementId: treatment._id,
              time: DATETRANSLATION[treatment.takingState][i],
              date: newNextDay,
              expire: false
            }).save().then(function (content) {
            // console.log('date valide and create new rappel');
            });
          }
        } else {
        // console.log('date not valid');

        }
      }
    });
  }

  function traitementToRappel (traitement) {
    var today = new Date();
    var endday = new Date(traitement.end);
    if (valideDate(today, endday)) {
      var newRappels = [];
      var rappel = {
        name: '',
        quantity: '',
        takingState: '',
        frequence: '',
        typeFrequence: '',
        info: ''
      };
      rappel.name = traitement.name;
      rappel.quantity = traitement.quantity;
      rappel.takingState = traitement.takingState;
      rappel.frequence = traitement.frequence;
      rappel.typeFrequence = traitement.typeFrequence;
      rappel.info = traitement.info;
      // console.log(DATETRANSLATION[traitement.takingState][0]);
      for (var i = 0; i < rappel.frequence; i++) {
        let tempRappel = new Reminder({
          userId: traitement.userId,
          rappel: rappel,
          traitementId: traitement._id,
          time: DATETRANSLATION[traitement.takingState][i],
          date: today,
          expire: false
        });
        newRappels.push(tempRappel);
      }
      // console.log(newRappels);
      return newRappels;
    } else {
      return null;
    }
  }

  function valideDate (today, endday) {
  // console.log(today);
  // console.log(endday);
    var year = new Date(today).getFullYear();
    var month = new Date(today).getMonth() + 1;
    var day = new Date(today).getDate();
    var newToday = new Date(year, month, day);
    var yearend = endday.getFullYear();
    var monthend = endday.getMonth() + 1;
    var dayend = endday.getDate();
    var newendday = new Date(yearend, monthend, dayend);
    // console.log('today:'+newToday.getTime());
    console.log('endday' + newendday.getTime());
    if (newendday.getTime() >= newToday.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  return router;
};
