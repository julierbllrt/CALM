module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });

  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'calm.coelab@gmail.com',
      pass: 'CalmCoelab1234'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  router.post('/mail/test', auth, function (req, res) {
    console.log('From mail API : we are going to send the mail.');
    var mailOptions = {
      from: 'calm.coelab@gmail.com',
      to: 'quentin.mezdru@gmail.com',
      subject: 'Sending test email from Node js CALM',
      text: 'YES !'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });

  router.post('/mail', auth, function (req, res) {
    var mailOptions = {
      from: 'calm.coelab@gmail.com',
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });

  return router;
};
