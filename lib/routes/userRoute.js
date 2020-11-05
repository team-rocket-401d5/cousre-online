'use strict';
const express = require('express');
const router = express.Router();
const users = require('../models/userCollection');
const basicAuth = require('../middlewares/basicAuthor.js');

router.post('/signup', signupHandler);

function signupHandler(req, res) {
  console.log(req.body);
  users.save(req.body).then((user) => {
    console.log(req.body);
    const token = users.generateToken(user);
    res.status(201).json({ token });
  });
}

router.post('/signin', basicAuth, signinHandler);

function signinHandler(req, res) {
  res.status(201).json({ token: req.token, user: req.user });
}
module.exports=router;
