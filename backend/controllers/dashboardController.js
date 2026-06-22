const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'manager';
    const userFilter = isAdmin ? {} : { assignedTo: req.user._id };

    const [totalLeads, totalCustomers, totalTasks, pendingTasks, wonLeads, lostLeads] =
      await Promise.all([
        Lead.countDocuments(userFilter),
        Customer.countDocuments(userFilter),
        Task.countDocuments(userFilter),
        Task.countDocuments({ ...userFilter, status: 'pending' }),
        Lead.countDocuments({ ...userFilter, status: 'won' }),
        Lead.countDocuments({ ...userFilter, status: 'lost' }),
      ]);

    // Lead status breakdown
    const leadsByStatus = await Lead.aggregate([
      ...(isAdmin ? [] : [{ $match: { assignedTo: req.user._id } }]),
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Monthly leads (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, ...userFilter } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalLeads,
      totalCustomers,
      totalTasks,
      pendingTasks,
      wonLeads,
      lostLeads,
      conversionRate: totalLeads ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0,
      leadsByStatus,
      monthlyLeads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('performedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getActivities };
