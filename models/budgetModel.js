const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
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
        title: {
          type: String,
          required: [true, 'Title for tag is required'],
        },
        amount: {
          type: Number,
          required: [true, 'Estimated amount is required for tag'],
        },
      },
    ],
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

budgetSchema.virtual('startDateFormat').get(function () {
  if (this.startDate) return new Date(this.startDate).toLocaleDateString();
});

budgetSchema.virtual('endDateFormat').get(function () {
  if (this.endDate) return new Date(this.endDate).toLocaleDateString();
});

module.exports = mongoose.model('Budget', budgetSchema);
