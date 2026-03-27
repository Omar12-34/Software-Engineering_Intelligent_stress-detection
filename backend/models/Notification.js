const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  stressLevel: {
    type: String,
    enum: ["NORMAL", "MILD", "HIGH"],
    default: "MILD"
  },
  metrics: {
    hrv: Number,
    eda: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
