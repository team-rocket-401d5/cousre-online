'use strict';
require('dotenv').config();
const superagent = require('superagent');
const users = require('../models/collections/userCollection.js');
const Usermodel = require('../models/user_schema');

/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

module.exports = async function authorize(req, res, next) {
  console.log('hiiiiiiiiiii its meeeeee');
  try {
    console.log('teeeeeeest', req.body.email);
    let [user, token] = await getUser(req.body.email);
    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }
};

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser, //take email for google sign in :unique username
    password: 'oauthpassword',
  };
  console.log(userRecord);
  const isSaved = await Usermodel.findOne({ username: userRecord.username }).select('username');
  let user;
  let token;
  console.log('__isSaved__', isSaved);
  if (!isSaved) {
    user = await users.save(userRecord);
    token = users.generateToken(user);
    return [user, token];
  } else {
    token = users.generateToken(isSaved);
    return [isSaved, token];
  }
}
