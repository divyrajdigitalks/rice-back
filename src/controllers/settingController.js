const Setting = require('../models/Setting');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Public (for now)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Public (for now)
exports.updateSettings = async (req, res, next) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
