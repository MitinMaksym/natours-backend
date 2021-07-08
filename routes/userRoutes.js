const express = require('express');
const usersController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/signup')
  .post(authController.signup);

  router
  .route('/login')
  .post(authController.login);

  router
  .route('/forgotPassword')
  .post(authController.forgotPassword);
  
  router
  .route('/resetPassword/:token')
  .patch(authController.resetPassword);

  router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

  router
  .route('/updateMe')
  .patch(authController.protect, usersController.updateMe);

  router
  .route('/deleteMe')
  .delete(authController.protect, usersController.deleteMe);

  router
  .route('/')
  .get(usersController.getUsers)
  .post(usersController.createUser);

  router
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(authController.protect,authController.restrictTo('admin'),usersController.deleteUser);

module.exports = router;
