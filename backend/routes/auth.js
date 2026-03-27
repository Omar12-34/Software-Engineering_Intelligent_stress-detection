const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ name });
    if (userExists) {
       return res.status(400).json({ success: false, error: 'Username already exists, please login instead' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashed
    });

    const token = signToken(user._id);

    res.status(201).json({ success: true, token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, error: 'Please provide username and password' });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid Username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid Password' });
    }

    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});

module.exports = router;