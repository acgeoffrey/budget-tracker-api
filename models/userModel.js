const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field is mandatory'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email field is mandatory'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password field is mandatory'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm password field is mandatory'],
      validate: {
        validator: function (data) {
          return data === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    avatar: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

// Hashing the password field
userSchema.pre('save', async function (next) {
  // Return if password is not modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Setting passwordModified time
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Check if password is correct
userSchema.methods.isPasswordCorrect = async function (inputPass, hashPass) {
  return await bcrypt.compare(inputPass, hashPass);
};

// Check is password changed after the creation of JWT
userSchema.methods.isPasswordModified = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const convertTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < convertTimestamp;
  }

  return false;
};

// Create Password Reset Token
userSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store the encrypted token in the DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10mins

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
