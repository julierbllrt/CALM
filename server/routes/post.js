module.exports = function (passport) {
  const express = require('express');
  const router = express.Router();
  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'CALM_SECRET',
    userProperty: 'payload'
  });

  var Post = require('../models/post');

  // Save the new post
  router.post('/post', auth, function (req, res, next) {
    var post = new Post();
    post.sender = req.body.sender;
    post.receiver = req.body.receiver;
    post.text = req.body.text;
    post.type = req.body.type;
    post.save(function (err) {
      if (err) {
        res.json(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  // Get the posts for a given user
  router.get('/post/:sender/:receiver', auth, function (req, res, next) {
    Post.find({sender: req.params.sender, receiver: req.params.receiver})
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  // Get all posts
  router.get('/post', auth, function (req, res, next) {
    Post.find({})
      .populate('doctor')
      .populate('patient')
      .exec(function (err, docs) {
        if (!err && docs) { res.json(docs); } else { res.json(err); }
      });
  });

  return router;
};
