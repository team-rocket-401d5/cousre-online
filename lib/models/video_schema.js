const mongoose = require('mongoose');

const video = new mongoose.Schema(
  {
    url_simple: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: String, required: true },
    note: { type: String, default: '' },
    isWatched: { type: Boolean, default: false },
    video_id: { type: String, required: true },
  },
  { _id: false },
);
module.exports = mongoose.model('video', video);
