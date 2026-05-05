const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Report = require('../models/Report');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChefs = await User.countDocuments({ role: 'chef' });
    const totalRecipes = await Recipe.countDocuments();
    const activeReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalChefs,
      totalRecipes,
      activeReports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .sort('-createdAt');
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve a report
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
const resolveReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (report) {
      report.status = req.body.status || 'resolved';
      if (req.body.actionTaken) {
        report.actionTaken = req.body.actionTaken;
      }
      
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      
      // Optionally delete all user recipes, comments, likes etc...
      // await Recipe.deleteMany({ chef: user._id });
      
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recipes
// @route   GET /api/admin/recipes
// @access  Private/Admin
const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate('chef', 'name email');
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getReports,
  resolveReport,
  getAllUsers,
  deleteUser,
  getAllRecipes,
};
