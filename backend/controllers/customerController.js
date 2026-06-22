const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'sales') query.assignedTo = req.user._id;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('convertedFrom');

    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({ ...req.body, createdBy: req.user._id });

    await Activity.create({
      type: 'customer_created',
      description: `Customer "${customer.name}" created`,
      relatedTo: { modelType: 'Customer', modelId: customer._id },
      performedBy: req.user._id,
    });

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (req.file) req.body.avatar = req.file.path;

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (admin only)
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.deleteOne();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
