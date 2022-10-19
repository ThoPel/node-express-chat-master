const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: Number, required: true },
});

module.exports = mongoose.model('Message', messageSchema);