const mongoose = require('mongoose');

const stressSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "demoUser"
  },
  stressLevel: {
    type: String,
    enum: ["NORMAL", "MILD", "HIGH"]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StressRecord', stressSchema);