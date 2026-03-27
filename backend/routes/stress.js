const express = require('express');
const router = express.Router();
const StressRecord = require('../models/StressRecord');

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

    // ✅ Mock stress logic (until ML is ready)
    let stress = "NORMAL";

    if (heartRate > 90 || eda > 3) stress = "HIGH";
    else if (heartRate > 80) stress = "MILD";

    // ✅ Save result to DB
    const record = await StressRecord.create({
      userId: "demoUser",
      stressLevel: stress
    });

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