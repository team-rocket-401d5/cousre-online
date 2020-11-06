const mongoose = require('mongoose');

const course = new mongoose.Schema({
  playlist: { type: Object, required: true },
  author: { type: Object, required: true },
  toral_duration: { type: Number, required: true },
  time_watched: { type: Number, default: 0 },
});

module.exports = mongoose.model('course', course);
