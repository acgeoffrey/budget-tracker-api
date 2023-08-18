const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const budgetRouter = require('./budgetRoutes');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword,
);

router.use('/:userId/budget', budgetRouter);

router
  .route('/')
  .post(userController.createUser)
  .get(authController.protect, userController.getMe)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
