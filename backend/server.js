const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// 🔥 Uncomment ONLY when MongoDB installed
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/data', require('./routes/data'));
app.use('/api/stress', require('./routes/stress'));

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