const Report = require('../models/Report');

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description,
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
};
