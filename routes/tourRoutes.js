const express = require('express');
const toursController = require('../controllers/tourConroller');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();

// router.param('id', toursController.checkID);

router.route('/tours-stats').get(toursController.getToursStats);

router
  .route('/month-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthPlan
  );

router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, toursController.getTours);

router
  .route('/')
  .get(toursController.getTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.createTour
  );

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    toursController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    toursController.deleteTour
  );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
