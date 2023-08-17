const express = require('express');
const budgetController = require('../controllers/budgetController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/record')
  .get(authController.protect, budgetController.getAllRecords)
  .post(authController.protect, budgetController.createRecord);

router
  .route('/record/:id')
  .get(authController.protect, budgetController.getRecord)
  .delete(authController.protect, budgetController.deleteRecord);

router
  .route('/category')
  .get(authController.protect, budgetController.getCategories);

router
  .route('/planner')
  .get(authController.protect, budgetController.getAllBudgets)
  .post(authController.protect, budgetController.createBudget);

module.exports = router;
