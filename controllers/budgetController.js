const Record = require('../models/recordSchema');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllRecords = catchAsync(async (req, res, next) => {
  // Query
  const apiFeatures = new APIFeatures(Record.find(), req.query, req.user)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const records = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    results: records.length,
    data: {
      records,
    },
  });
});

exports.createRecord = catchAsync(async (req, res, next) => {
  const newRecord = await Record.create({
    ...req.body,
    category: req.body.category.toLowerCase(),
    date: Date.now(),
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
