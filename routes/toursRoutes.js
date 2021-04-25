const express = require('express');
const toursController = require('../controllers/toursConroller');
const router = express.Router();

router.param('id', toursController.checkID);

router
  .route('/')
  .get(toursController.getTours)
  .post(toursController.checkBody, toursController.createTour);
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTourById)
  .delete(toursController.deleteTourById);

module.exports = router;
