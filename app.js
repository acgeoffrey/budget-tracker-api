const express = require('express');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const budgetRouter = require('./routes/budgetRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/v1/budget', budgetRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
