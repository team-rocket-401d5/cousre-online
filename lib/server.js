// set-up
const express = require('express');
var ytpl = require('ytpl');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
let userRouter = require('./routes/userRoute.js');
// middlewares
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.json('hello world');
});
app.use('/', userRouter);
app.get('/playlist', async (req, res) => {
  const playlist = await ytpl(req.body.playlist);
  res.json(playlist);
});

module.exports = {
  server: app,
  start: () => {
    app.listen(PORT, () => {
      console.log(`up and running on port ${PORT}`);
    });
  },
};
