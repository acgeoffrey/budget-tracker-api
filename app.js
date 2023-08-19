const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const budgetRouter = require('./routes/budgetRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES

// Security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limiting requests from same IP
app.use(
  '/api',
  rateLimiter({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from the same IP, please try again later',
  }),
);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (Cross site scripting attacks)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use('/api/v1/budget', budgetRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
