const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const budgetRouter = require('./budgetRoutes');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use('/:userId/budget', budgetRouter);

router.route('/').post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
