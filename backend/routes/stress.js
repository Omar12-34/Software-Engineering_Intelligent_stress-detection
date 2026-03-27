const express = require('express');
const router = express.Router();
const StressRecord = require('../models/StressRecord');
const getPrediction = require('../services/mlService');

router.post('/analyze', async (req, res) => {
  try {
    const { heartRate, eda } = req.body;

    // ✅ Validation
    if (!heartRate || !eda) {
      return res.status(400).json({
        success: false,
        message: "heartRate and eda are required"
      });
    }

    // ✅ AI Stress Prediction
    let stress = "NORMAL";
    try {
      const prediction = await getPrediction({ heartRate, eda });
      // Use ML result, adapting to potential response formats
      stress = prediction.stressLevel || prediction.prediction || "NORMAL";
    } catch (err) {
      console.error("ML service unavailable, using fallback logic:", err.message);
      // Fallback logic
      if (heartRate > 90 || eda > 3) stress = "HIGH";
      else if (heartRate > 80) stress = "MILD";
    }

    // ✅ Save result to DB (Optional, wrap in try/catch to avoid freezing)
    let record = null;
    try {
      record = await StressRecord.create({
        userId: "demoUser",
        stressLevel: stress
      });
    } catch(dbErr) {
       console.warn("Could not save to DB (perhaps MongoDB is offline). Proceeding with prediction.");
    }

    res.status(200).json({
      success: true,
      stressLevel: stress,
      data: record
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;