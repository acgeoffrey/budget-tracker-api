const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Settings = require('../models/settingsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, settings, statusCode, res) => {
  const token = signToken(user.id);
  const expiresIn = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  );
  const cookieOptions = {
    expires: expiresIn,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    expiresIn,
    data: {
      user,
      settings,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  await Settings.create({ user: newUser._id });

  res.status(201).json({
    status: 'success',
    message: 'Account created. Please Login to continue.',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError(`Incorrect Email or Password`, 401));
  }

  const settings = await Settings.findOne({ user: user.id });

  createSendToken(user, settings, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Checking token presence
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in. Please login to get access.`, 401),
    );
  }

  // Verifying token
  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  const user = await User.findById(decodeToken.id);
  if (!user) {
    return next(
      new AppError('User belonging to this token does not exists.', 401),
    );
  }

  if (user.isPasswordModified(decodeToken.iat)) {
    return next(
      new AppError(
        'User has changed the password recently! Please login again.',
        401,
      ),
    );
  }

  req.user = user;
  next();
});

exports.authorizeOnlyTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to perform this action`, 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with email address', 404));

  const resetToken = user.createPassResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Here is your password reset link. Submit a patch request with your new password to: ${resetURL}.\n
  If you didn't request this action, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password Reset Link sent to email',
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful. Please Login to continue.',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  if (!passwordCurrent || !password || !passwordConfirm)
    return next(new AppError('Required field is/are missing.', 400));

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.isPasswordCorrect(passwordCurrent, user.password)))
    return next(new AppError('Your current password is incorrect!', 401));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully!',
  });
});
