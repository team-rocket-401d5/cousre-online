const mongoose = require('mongoose');

const author = new mongoose.Schema(
  {
    name: { type: String, required: true },
    channel_url: { type: String, required: true },
  },
  { _id: false }
);
module.exports = mongoose.model('author', author);
