const Freight = require('../models/Freight');

exports.getFreights = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { country: { $regex: search, $options: 'i' } },
          { portName: { $regex: search, $options: 'i' } },
        ]
      };
    }

    const total = await Freight.countDocuments(query);
    const data = await Freight.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: data.length, 
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data 
    });
  } catch (err) {
    next(err);
  }
};

exports.getFreight = async (req, res, next) => {
  try {
    const data = await Freight.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createFreight = async (req, res, next) => {
  try {
    const data = await Freight.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateFreight = async (req, res, next) => {
  try {
    const data = await Freight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteFreight = async (req, res, next) => {
  try {
    const data = await Freight.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
