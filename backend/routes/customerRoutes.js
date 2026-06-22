const express = require('express');
const router = express.Router();
const {
  getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router.route('/:id')
  .get(protect, getCustomer)
  .put(protect, upload.single('avatar'), updateCustomer)
  .delete(protect, authorize('admin'), deleteCustomer);

module.exports = router;
