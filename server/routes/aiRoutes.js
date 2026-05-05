const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.route('/chat').post(protect, chatWithAI);

module.exports = router;
