const mongoose = require('mongoose');
// const { unescape } = require('querystring');
const section = new mongoose.Schema(
  {
    section_title: { type: String, required: true },
    videos: { type: [Object], required: true },
  },
  { _id: false }
);

module.exports = mongoose.model('section', section);
