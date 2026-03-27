const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  heartRate: {
    type: Number,
    required: true
  },
  eda: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SensorData', sensorSchema);