const dashboardService = require('../services/dashboard.service');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
