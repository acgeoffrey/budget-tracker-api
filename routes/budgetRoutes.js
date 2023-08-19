const express = require('express');
const budgetController = require('../controllers/budgetController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/record')
  .get(budgetController.getAllRecords)
  .post(budgetController.createRecord);

router
  .route('/record/:id')
  .get(budgetController.getRecord)
  .patch(budgetController.updateRecord)
  .delete(budgetController.deleteRecord);

router.route('/category').get(budgetController.getCategories);

router
  .route('/planner')
  .get(budgetController.getAllBudgets)
  .post(budgetController.createBudget);

router
  .route('/planner/:id')
  .get(budgetController.getBudget)
  .patch(budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
