const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getTrendingRecipes,
} = require('../controllers/recipeController');
const { protect, chef } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/trending/now', getTrendingRecipes);

router
  .route('/')
  .get(getRecipes)
  .post(protect, chef, upload.single('image'), createRecipe);

router
  .route('/:id')
  .get(getRecipeById)
  .put(protect, chef, upload.single('image'), updateRecipe)
  .delete(protect, chef, deleteRecipe);

module.exports = router;
