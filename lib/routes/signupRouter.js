'use strict';
const express = require('express');
const router = express.Router();
const bearerMW = require('../middlewares/Bearer.js');
const users = require('../models/collections/userCollection');
const basicAuth = require('../middlewares/basicAuthor.js');
const oauth = require('../middlewares/aouthr.js');

router.post('/signup', signupHandler);
router.post('/signin', basicAuth, signinHandler);

function signupHandler(req, res) {
  users.save(req.body)
    .then(user => {
      const token = users.generateToken(user);
      res.status(201).json({ token });
    });
}
function signinHandler(req, res) {
  res.status(201).json({ token: req.token });
}
router.get('/oauth', oauth, (req, res) => {
  res.status(200).json({ token_value: req.token });
});
router.get('/secret', bearerMW, (req, res) => {
  res.status(201).send('it\'s working');
});
module.exports = router;
