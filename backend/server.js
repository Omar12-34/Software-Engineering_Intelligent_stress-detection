const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { startSimulation } = require('./services/simulationService');

dotenv.config();

// 🔥 Uncomment ONLY when MongoDB installed
connectDB().then(() => {
  // Data simulation in backend is now disabled as per requirements.
  // We rely on the frontend data flowing into the database via /api/stress/analyze
  console.log("Database connection ready.");
}).catch(err => console.error("Could not connect to DB:", err));

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/data', require('./routes/data'));
app.use('/api/stress', require('./routes/stress'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notifications', require('./routes/notifications'));

// Test route
app.get('/', (req, res) => {
  res.send('API Running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});