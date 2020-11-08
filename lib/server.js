'use strict';

// set-up
require('dotenv').config();
const express = require('express');
const app = express();
const ytpl = require('ytpl');
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const userRouter = require('./routes/userRouter.js');
const publicRouter = require('./routes/publicRouter.js');
const signupRouter = require('./routes/signupRouter.js');
const err404 = require('./middlewares/404.js');
const err500 = require('./middlewares/500.js');


// middlewares
app.use(express.json());
app.use(express.static('./public'));
app.use(cors());




// routers
app.get('/', getmainHandler);
app.get('/playlist', getPlaylistHandler);

app.use('/', signupRouter);
app.use('/user', userRouter);
app.use('/public', publicRouter);

//errors
app.use(err404);
app.use(err500);

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
