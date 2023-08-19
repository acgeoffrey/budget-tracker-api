const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Settings = require('../models/settingsModel');
const Record = require('../models/recordModel');
const Budget = require('../models/budgetModel');

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const settings = await Settings.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      user,
      settings,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user)
    return next(new AppError('Something went wrong. Please login again.', 401));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Settings.deleteMany({ user: req.user.id });
  await Record.deleteMany({ user: req.user.id });
  await Budget.deleteMany({ user: req.user.id });

  await User.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUserSettings = catchAsync(async (req, res, next) => {
  const settings = await Settings.findOne({ user: req.user.id });

  settings.currency = req.body.currency ? req.body.currency : settings.currency;

  console.log(req.body);

  settings.expenseCategories = req.body.expenseCategories
    ? [...settings.expenseCategories, req.body.expenseCategories]
    : settings.expenseCategories;
  settings.incomeCategories = req.body.incomeCategories
    ? [...settings.incomeCategories, req.body.incomeCategories]
    : settings.incomeCategories;

  await settings.save();

  res.status(200).json({
    status: 'success',
    message: 'Settings updated.',
  });
});
