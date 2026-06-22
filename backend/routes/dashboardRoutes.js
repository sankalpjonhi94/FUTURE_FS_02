const express = require('express');
const router = express.Router();
const { getStats, getActivities } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/activities', protect, getActivities);

module.exports = router;
