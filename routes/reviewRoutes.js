const express = require('express')
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

const router = express.Router({mergeParams:true})

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

  router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)

  module.exports = router