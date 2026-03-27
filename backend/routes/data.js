const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');

router.post('/', async (req, res) => {
  try {
    const { heartRate, eda } = req.body;

    // ✅ Validation
    if (!heartRate || !eda) {
      return res.status(400).json({
        success: false,
        message: "heartRate and eda are required"
      });
    }

    // ✅ Save to DB (if MongoDB connected)
    const data = await SensorData.create({
      heartRate,
      eda
    });

    res.status(201).json({
      success: true,
      message: "Sensor data saved",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;