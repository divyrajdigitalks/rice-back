const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    usdInrRate: {
      type: Number,
      default: 93.50,
    },
    inlandFreight: {
      type: Number,
      default: 2000,
    },
    customsThc: {
      type: Number,
      default: 45000,
    },
    companyName: {
      type: String,
      default: 'RiseCRM Enterprise',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
