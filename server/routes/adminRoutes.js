const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getReports,
  resolveReport,
  getAllUsers,
  deleteUser,
  getAllRecipes,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.route('/reports').get(getReports);
router.route('/reports/:id').put(resolveReport);
router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/recipes').get(getAllRecipes);

module.exports = router;
