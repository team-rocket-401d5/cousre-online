const mongoose = require('mongoose');

const course = new mongoose.Schema({
  playlist: { type: Object, required: true },
  author: { type: Object, required: true },
  total_duration: { type: Number, required: true },
  time_watched: { type: Number, default: 0 },
  sections: { type: [Object], required: true },
  publisher: { type: String, required: true },
});

module.exports = mongoose.model('public_course', course);
