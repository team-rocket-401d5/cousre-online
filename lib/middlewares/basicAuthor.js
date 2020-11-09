const base64 = require('base-64');
const users = require('../models/collections/userCollection.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {

    const basicAuth = req.headers.authorization.split(' ').pop(); 
    const [user, pass] = base64.decode(basicAuth).split(':'); 
 
    users.authenticateBasic(user, pass)
      .then((validUser) => {
     
        req.token = users.generateToken(validUser);
        req.user = validUser;

        next();
      })
      .catch((err) => next('Invalid Login'));
  }
};
