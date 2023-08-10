const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🚨 SHUTTING DOWN...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log(`Connected to Database successfully!`));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🚨 SHUTTING DOWN...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
