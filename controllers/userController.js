const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.createUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Controller yet to be build',
  });
};

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Controller yet to be build',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
