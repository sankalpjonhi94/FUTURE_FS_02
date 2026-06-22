const express = require('express');
const router = express.Router();
const {
  getLeads, getLead, createLead, updateLead, deleteLead, convertLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router.route('/:id')
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, authorize('admin', 'manager'), deleteLead);

router.post('/:id/convert', protect, convertLead);

module.exports = router;
