const express = require('express');
const toursController = require('../controllers/toursConroller');
const authController = require('../controllers/authController');
const router = express.Router();

//router.param('id', toursController.checkID);

router.route('/tours-stats').get(toursController.getToursStats);
router.route('/month-plan/:year').get(toursController.getMonthPlan);
router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, toursController.getTours);
router
  .route('/')
  .get(authController.protect, toursController.getTours)
  .post(toursController.createTour);
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTourById)
  .delete(toursController.deleteTourById);

module.exports = router;
