const Exmill = require('../models/Exmill');

exports.getExmills = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { variety: { $regex: search, $options: 'i' } },
          { form: { $regex: search, $options: 'i' } },
        ]
      };
    }

    const total = await Exmill.countDocuments(query);
    const data = await Exmill.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

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

exports.getExmill = async (req, res, next) => {
  try {
    const data = await Exmill.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createExmill = async (req, res, next) => {
  try {
    const data = await Exmill.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateExmill = async (req, res, next) => {
  try {
    const data = await Exmill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteExmill = async (req, res, next) => {
  try {
    const data = await Exmill.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
