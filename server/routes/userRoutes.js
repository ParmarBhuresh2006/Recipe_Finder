const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getChefs,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/chefs', getChefs);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profileImage'), updateUserProfile);
router.route('/:id')
  .get(getUserById);

module.exports = router;
