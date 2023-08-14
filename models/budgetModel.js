const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A budget reqires a title'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  tags: [
    {
      title: String,
      amount: Number,
    },
  ],
});

module.exports = mongoose.model('Budget', budgetSchema);
