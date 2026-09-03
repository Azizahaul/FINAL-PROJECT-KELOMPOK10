// routes/chat.routes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.post('/', chatController.processChat);

module.exports = router;