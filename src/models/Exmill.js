const mongoose = require('mongoose');

const exmillSchema = new mongoose.Schema(
  {
    variety: {
      type: String,
      required: [true, 'Please add a variety'],
      trim: true,
    },
    form: {
      type: String,
      required: [true, 'Please add a form'],
      trim: true,
    },
    inrPerKg: {
      type: Number,
      required: [true, 'Please add INR per Kg'],
    },
    inrPerMt: {
      type: Number,
    },
    usdPerMt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exmill', exmillSchema);
