const mongoose = require('mongoose');

const playlist = new mongoose.Schema(
  {
    url: { type: String, required: true },
    playlist_title: { type: String, required: true },
    description: { type: String, required: true },
    total_items: { type: Number, required: true },
  },
  { _id: false }
);
module.exports = mongoose.model('playlist', playlist);
