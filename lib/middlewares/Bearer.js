'use strict';

const users = require('../models/collections/userCollection.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('UnAuthorized');
  } else {
    const token = req.headers.authorization.split(' ').pop();
    console.log(token);

    users
      .authenticateJWT(token)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(error => {
        console.log(error);
        next('Invalid JWT');
      });
  }
};
