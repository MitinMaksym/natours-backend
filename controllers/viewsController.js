const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (_, res) => {
  const tours = await Tour.find({});
  res.status(200).render('overview', { tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no  tour with such a name', 404));
  }
  res.status(200).render('tour', { tour: tour, title: tour.name });
});

exports.getLoginForm = async (req, res) => {
  res.status(200).render('login', { title: 'Log into you account' });
};

exports.getAccount = (_, res) => {
  res.status(200).render('account', { title: 'Your account' });
};
