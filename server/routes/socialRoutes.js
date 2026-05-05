const express = require('express');
const router = express.Router();
const {
  toggleLike,
  addComment,
  getRecipeComments,
  deleteComment,
  toggleFollow,
  toggleBookmark,
} = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recipes/:id/like', protect, toggleLike);
router.route('/recipes/:id/comments')
  .post(protect, addComment)
  .get(getRecipeComments);
router.delete('/comments/:id', protect, deleteComment);
router.post('/users/:id/follow', protect, toggleFollow);
router.post('/recipes/:id/bookmark', protect, toggleBookmark);

module.exports = router;
