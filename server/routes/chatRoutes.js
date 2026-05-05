const express = require('express');
const { handleChat } = require('../controllers/chatController.js');

const router = express.Router();

router.post('/', handleChat);

module.exports = router;
