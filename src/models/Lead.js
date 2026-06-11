const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    contactPerson: {
      type: String,
      required: [true, 'Please add a contact person'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
    },
    assignedTo: {
      type: String,
    },
    country: {
      type: String,
    },
    priceType: {
      type: String,
    },
    variety: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exmill',
    },
    form: {
      type: String,
    },
    size: {
      type: String,
    },
    packType: {
      type: String,
    },
    cifCountry: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
