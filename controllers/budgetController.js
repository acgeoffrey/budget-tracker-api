const mongoose = require('mongoose');
const Record = require('../models/recordModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/AppError');

exports.getAllRecords = catchAsync(async (req, res, next) => {
  // Query
  const apiFeatures = new APIFeatures(Record.find(), req.query, req.user)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const records = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    results: records.length,
    data: {
      records,
    },
  });
});

exports.getRecord = catchAsync(async (req, res, next) => {
  const record = await Record.findById(req.params.id);

  if (!record) return next(new AppError('No Record found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      record,
    },
  });
});

exports.createRecord = catchAsync(async (req, res, next) => {
  const newRecord = await Record.create({
    ...req.body,
    category: req.body.category.toLowerCase(),
    date: req.body.date ? req.body.date : Date.now(),
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      record: newRecord,
    },
  });
});

exports.deleteRecord = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Controller yet to be build',
  });
};

exports.getCategories = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.body;

  const match = {
    recordType: { $eq: 'expense' },
  };
  if (startDate && endDate) {
    match.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  // console.log(match);

  const categoryStats = await Record.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $match: match,
    },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numRecords: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $sort: { totalAmount: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      categoryStats,
    },
  });
});
