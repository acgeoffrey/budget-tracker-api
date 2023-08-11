const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  financeType: {
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
    unique: true,
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
});

module.exports = mongoose.model('Finance', financeSchema);
