// set-up
const express = require('express');
var ytpl = require('ytpl');
require('dotenv').config();
const app = express();

// middlewares
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.json('hello world');
});

app.get('/playlist', async (req, res) => {
  const playlist = await ytpl(req.body.playlist);
  res.json(playlist);
});

const PORT = process.env.PORT || 3000;
module.exports = {
  server: app,
  start: () => {
    app.listen(PORT, () => {
      console.log(`up and running on port ${PORT}`);
    });
  },
};
