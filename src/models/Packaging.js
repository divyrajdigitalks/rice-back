const mongoose = require('mongoose');

const packagingSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  packSize: {
    type: String,
    required: true,
    trim: true
  },
  mtCapacity: {
    type: Number,
    required: false
  },
  packagingRate: {
    type: Number,
    required: false
  }
}, { timestamps: true });

// Ensure uniqueness for the combination of productName and packSize
packagingSchema.index({ productName: 1, packSize: 1 }, { unique: true });

module.exports = mongoose.model('Packaging', packagingSchema);
