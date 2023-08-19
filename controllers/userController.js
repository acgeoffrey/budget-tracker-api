const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Settings = require('../models/settingsModel');

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
  await User.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
