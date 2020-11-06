'use strict';
require('dotenv').config();
const superagent = require('superagent');
const users = require('../models/userCollection.js');


/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

const tokenServerUrl = process.env.TOKEN_SERVER;
const remoteAPI = process.env.REMOTE_API;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.APISERVER;

module.exports = async function authorize(req, res, next) {
  try {
    console.log('inside try');
    let code = req.query.code;
    console.log('(10000000000000) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', user);

    next();
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }
};

async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  // console.log('this is the token ', access_token);

  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent
    .get(remoteAPI)
    .set('user-agent', 'express-app')
    .query({
      alt: 'json',
      access_token: token,
    });

  let user = userResponse.body;

  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.email,//take email for google sign in :uniqe username
    password: 'oauthpassword',
  };

  let user = await users.save(userRecord);
  let token = users.generateToken(user);

  return [user, token];
}