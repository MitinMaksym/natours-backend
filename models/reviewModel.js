const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review text is requred'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to a user'],
    },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    createdAt: {
      type: Date,
      default: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;
