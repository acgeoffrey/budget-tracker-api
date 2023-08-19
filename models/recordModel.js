const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      index: true,
    },
    recordType: {
      type: String,
      required: [true, 'Provide the type. Income or Expense'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type is either Income or Expense',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    category: {
      type: String,
      lowercase: true,
      trim: true,
      default: 'others',
    },
    notes: {
      type: String,
      trim: true,
    },
    date: Date,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexing the fields that will be queried often
recordSchema.index({ title: 'text' });
recordSchema.index({ amount: 1, date: 1 });

module.exports = mongoose.model('Record', recordSchema);
