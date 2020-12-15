const mongoose = require('mongoose');

const messageQ = new mongoose.Schema({
  room_id: { type: String, required: true },
  messages: { type: [Object], required: true },
});

module.exports = mongoose.model('messageQ', messageQ);
