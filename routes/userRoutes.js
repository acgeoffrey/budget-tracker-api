const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all the below routes with this authentication middleware
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router
  .route('/all')
  .get(authController.authorizeOnlyTo('admin'), userController.getAllUsers);

router
  .route('/')
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router
  .route('/settings')
  .patch(userController.updateUserSettings)
  .delete(userController.deleteTags);

module.exports = router;
