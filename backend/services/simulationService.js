const SensorData = require('../models/SensorData');
const StressRecord = require('../models/StressRecord');
const ContextEvent = require('../models/ContextEvent');
const getPrediction = require('./mlService');

/**
 * Simulates wearable sensor data and stress alerts.
 * This file allows clean swapping to real data later.
 */

// Simulated users to log data for
const TEST_USER_ID = "demoUser";

let simulationInterval = null;

const generateRandomData = () => {
  // Typical resting heart rate is ~60-100. Let's add variations.
  const heartRate = Math.floor(Math.random() * (120 - 60 + 1) + 60);
  
  // EDA usually varies between 1-20 microSiemens
  const eda = parseFloat((Math.random() * 5 + 1).toFixed(2));
  
  // Base fallback stress logic
  let stressLevel = "NORMAL";
  let description = "User is resting.";
  
  if (heartRate > 100) {
    stressLevel = "HIGH";
    description = "Take a break, practice deep breathing.";
  } else if (heartRate > 85) {
    stressLevel = "MILD";
    description = "Slightly elevated. Stay hydrated and stretch.";
  }

  return { heartRate, eda, stressLevel, description };
};

const runSimulationTick = async () => {
  try {
    const data = generateRandomData();

    // ✅ Integrate AI model prediction
    try {
      const mlPrediction = await getPrediction({ heartRate: data.heartRate, eda: data.eda });
      if (mlPrediction && (mlPrediction.stressLevel || mlPrediction.prediction)) {
        data.stressLevel = mlPrediction.stressLevel || mlPrediction.prediction;
        
        // Dynamically assign description based on ML output
        if (data.stressLevel === "HIGH") data.description = "Take a break, practice deep breathing. (AI)";
        else if (data.stressLevel === "MILD") data.description = "Slightly elevated. Stay hydrated and stretch. (AI)";
        else data.description = "User is resting. (AI)";
      }
    } catch (err) {
      console.error("[Simulation] ML service unavailable, using hardcoded fallback logic.", err.message);
    }

    // Log sensor data
    const sensorDoc = await SensorData.create({
      heartRate: data.heartRate,
      eda: data.eda
    });

    // If there's stress, log a stress record
    if (data.stressLevel !== "NORMAL") {
      await StressRecord.create({
        userId: TEST_USER_ID,
        stressLevel: data.stressLevel
      });

      // Log recommendation/alert as a ContextEvent
      await ContextEvent.create({
        userId: TEST_USER_ID,
        eventType: "STRESS_ALERT",
        description: data.description
      });
      
      console.log(`[Simulation] Stress Alert logged: ${data.stressLevel}`);
    }

    console.log(`[Simulation] Logged data: HR=${data.heartRate} EDA=${data.eda}`);
  } catch (error) {
    console.error("[Simulation] Error logging simulated data:", error.message);
  }
};

const startSimulation = (intervalMs = 10000) => {
  if (simulationInterval) return;
  console.log(`[Simulation] Starting data simulation every ${intervalMs}ms...`);
  simulationInterval = setInterval(runSimulationTick, intervalMs);
  runSimulationTick(); // run first tick immediately
};

const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("[Simulation] Stopped.");
  }
};

module.exports = {
  startSimulation,
  stopSimulation,
  generateRandomData
};
