const express = require('express');
const router = express.Router();
const ContextEvent = require('../models/ContextEvent');

router.post('/', async (req, res) => {
  const event = await ContextEvent.create(req.body);
  res.json(event);
});

module.exports = router;