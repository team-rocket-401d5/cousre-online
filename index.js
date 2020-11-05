require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./lib/server');

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/course_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.start();
  })
  .catch(err => {
    console.error(err.message);
  });
