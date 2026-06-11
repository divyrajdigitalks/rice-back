const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public (for now)
const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { contactPerson: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ]
      };
    }

    const total = await Lead.countDocuments(query);
    const data = await Lead.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: data.length, 
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Public
const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
};
