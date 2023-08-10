const express = require('express');
const budgetController = require('../controllers/budgetController');

const router = express.Router({ mergeParams: true });

router
  .route('/expense')
  .get(budgetController.getAllExpenses)
  .post(budgetController.createExpense);

router.route('/expense/:id').delete(budgetController.deleteExpense);

module.exports = router;
