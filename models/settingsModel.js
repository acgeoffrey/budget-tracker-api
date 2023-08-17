const mongoose = require('mongoose');

const settingsSchmea = new mongoose.Schema({
  currency: {
    type: String,
    default: 'INR',
    trim: true,
  },
  expenseCategories: {
    type: [String],
    default: [
      'food',
      'entertainment',
      'housing',
      'transportation',
      'healthcare',
      'education',
      'personal',
      'insurance',
      'investments',
      'utilities',
      'business',
      'other',
    ],
  },
  incomeCategories: {
    type: [String],
    default: [
      'salary',
      'part time work',
      'interest',
      'rental',
      'business',
      'gift',
      'other',
    ],
  },
});

module.exports = mongoose.model('Settings', settingsSchmea);
