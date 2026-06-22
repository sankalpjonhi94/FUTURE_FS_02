const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'sales') query.assignedTo = req.user._id;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ leads, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user._id });

    await Activity.create({
      type: 'lead_created',
      description: `Lead "${lead.name}" created`,
      relatedTo: { modelType: 'Lead', modelId: lead._id },
      performedBy: req.user._id,
    });

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await Activity.create({
      type: 'lead_updated',
      description: `Lead "${lead.name}" updated`,
      relatedTo: { modelType: 'Lead', modelId: lead._id },
      performedBy: req.user._id,
    });

    res.json(updatedLead);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (admin/manager)
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await lead.deleteOne();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert lead to customer
// @route   POST /api/leads/:id/convert
// @access  Private
const convertLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (lead.convertedToCustomer) {
      return res.status(400).json({ message: 'Lead already converted' });
    }

    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
      convertedFrom: lead._id,
      assignedTo: lead.assignedTo,
      createdBy: req.user._id,
    });

    lead.convertedToCustomer = true;
    lead.status = 'won';
    await lead.save();

    await Activity.create({
      type: 'lead_converted',
      description: `Lead "${lead.name}" converted to customer`,
      relatedTo: { modelType: 'Lead', modelId: lead._id },
      performedBy: req.user._id,
    });

    res.status(201).json({ message: 'Lead converted successfully', customer });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead, convertLead };
