require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./lib/server');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
  
  })
  .then(() => {
    server.start();
  })
  .catch(err => {
    console.error(err.message);
  });
