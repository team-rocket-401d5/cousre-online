'use strict';

// set-up
require('dotenv').config();
const express = require('express');
const app = express();
const ytpl = require('ytpl');
const PORT = process.env.PORT || 3000;

const userRouter = require('./routes/userRouter.js');
const publicRouter = require('./routes/publicRouter.js');
const signupRouter = require('./routes/signupRouter.js');

// middlewares
app.use(express.json());
app.use(express.static('./public'));

app.get('/home', getmainHandler);
app.get('/playlist', getPlaylistHandler);

app.use('/',signupRouter);
app.use('/users', userRouter);
app.use('/public', publicRouter);

function getmainHandler(req, res) {
  res.json('hello world');
}
async function getPlaylistHandler(req, res) {
  const playlist = await ytpl(req.body.playlist);
  res.json(playlist);
}

module.exports = {
  server: app,
  start: () => {
    app.listen(PORT, () => {
      console.log(`up and running on port ${PORT}`);
    });
  },
};
