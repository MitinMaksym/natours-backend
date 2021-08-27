const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const upload = multer({ dest: 'public/img/users' });

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
