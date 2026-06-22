const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    convertedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
