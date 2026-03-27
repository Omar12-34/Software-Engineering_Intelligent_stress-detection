from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
# Enable CORS so browser (NextJS) can ping this directly bypassing the Node backend
CORS(app)

# Load the model using joblib (recommended for scikit-learn models)
MODEL_PATH = 'stress_model.pkl'

try:
    if os.path.exists(MODEL_PATH):
        stress_model = joblib.load(MODEL_PATH)
        print(f"✅ Model {MODEL_PATH} loaded successfully.")
    else:
        print(f"❌ Model file {MODEL_PATH} not found.")
        stress_model = None
except Exception as e:
    print(f"❌ Error loading model: {e}")
    stress_model = None


@app.route('/predict', methods=['POST'])
def predict():
    if not stress_model:
        return jsonify({"error": "Model not loaded on the server"}), 500
        
    data = request.json
    
    try:
        hr = float(data.get('heartRate', 70))
        eda = float(data.get('eda', 2.0))
        
        # --- DYNAMIC FEATURE CALCULATION ---
        # The model expects exactly 11 HRV-related features:
        # ['MEAN_RR', 'RMSSD', 'SDRR', 'pNN50', 'LF', 'HF', 'LF_HF', 'VLF', 'LF_HF_ratio', 'HRV_balance', 'variability']
        # We calculate realistic approximations of these based on the heartRate & EDA
        
        # 1. MEAN_RR (R-R interval in ms): 60,000 ms per minute / heart rate
        mean_rr = 60000.0 / hr if hr > 0 else 850.0
        
        # Create a "stress factor" (higher hr & eda = higher stress) -> less variability
        stress_factor = max(0, ((hr - 60) / 40.0) + (eda / 10.0))
        
        # 2-4. Time-Domain Features (decrease during stress)
        rmssd = max(5.0, 80.0 - (stress_factor * 40) + np.random.normal(0, 3))
        sdrr = max(10.0, 100.0 - (stress_factor * 50) + np.random.normal(0, 5))
        pnn50 = max(0.0, 30.0 - (stress_factor * 20) + np.random.normal(0, 2))
        
        # 5-8. Frequency-Domain Features
        # Parasympathetic (rest) reduces during stress
        hf = max(100.0, 1200.0 - (stress_factor * 600) + np.random.normal(0, 50))
        # Sympathetic usually increases during stress
        lf = max(100.0, 400.0 + (stress_factor * 400) + np.random.normal(0, 50))
        vlf = max(50.0, 300.0 + (stress_factor * 100) + np.random.normal(0, 20))
        
        # 9-11. Ratios and Indexes
        lf_hf_ratio = lf / hf if hf > 0 else 3.0
        lf_hf = lf_hf_ratio # Sometimes datasets duplicate this column
        hrv_balance = lf_hf_ratio
        variability = sdrr
        
        # Format the features into a Pandas DataFrame so it retains the feature names
        import pandas as pd
        
        feature_names = ['MEAN_RR', 'RMSSD', 'SDRR', 'pNN50', 'LF', 'HF', 'LF_HF', 'VLF', 'LF_HF_ratio', 'HRV_balance', 'variability']
        features = pd.DataFrame([[
            mean_rr, rmssd, sdrr, pnn50, lf, hf, lf_hf, vlf, lf_hf_ratio, hrv_balance, variability
        ]], columns=feature_names)
        
        # Make the prediction
        prediction = stress_model.predict(features)[0]
        
        # Map integer predictions to stress levels
        stress_level = str(prediction)
        if stress_level == '0':
            stress_level = 'NORMAL'
        elif stress_level == '1':
            stress_level = 'MILD'
        elif stress_level == '2':
            stress_level = 'HIGH'
            
        return jsonify({
            "success": True,
            "stressLevel": stress_level,
            "prediction_raw": str(prediction),
            "calculated_features": {
                "mean_rr": mean_rr,
                "rmssd": rmssd,
                "lf_hf_ratio": lf_hf_ratio
            }
        })
        
    except ValueError as e:
        return jsonify({"error": f"Invalid input data format: {e}"}), 400
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({
            "error": "Prediction failed", 
            "details": str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 Starting ML Server on port 5001...")
    app.run(port=5001, debug=True)
