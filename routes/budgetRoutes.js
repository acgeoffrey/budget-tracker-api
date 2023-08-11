const express = require('express');
const budgetController = require('../controllers/budgetController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/record')
  .get(authController.protect, budgetController.getAllRecords)
  .post(authController.protect, budgetController.createRecord);

router
  .route('/category')
  .get(authController.protect, budgetController.getCategories);

router
  .route('/record/:id')
  .delete(authController.protect, budgetController.deleteRecord);

module.exports = router;
