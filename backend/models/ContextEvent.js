const mongoose = require('mongoose');

const contextSchema = new mongoose.Schema({
  userId: String,
  eventType: String,
  description: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContextEvent', contextSchema);