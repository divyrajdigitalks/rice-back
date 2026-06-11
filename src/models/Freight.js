const mongoose = require('mongoose');

const freightSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Please add a country'],
      trim: true,
    },
    portName: {
      type: String,
      required: [true, 'Please add a port name'],
      trim: true,
    },
    seaFreightUsd: {
      type: Number,
      required: [true, 'Please add Sea Freight USD per container'],
    },
    cocUsd: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Freight', freightSchema);
