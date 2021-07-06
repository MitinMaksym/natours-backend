const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const { deleteOne } = require('./handleFactory');

// exports.checkID = (req, res, next, val) => {
//   const tour = tours.find((tour) => tour.id === +val);
//   console.log(tour);
//   if (!tour) {
//     console.log(5);

//     return res.status(404).send({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .send({ status: 'fail', message: 'Price or name was not provided' });
//   }
//   next();
// };

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'price ratingsAverage summary';
  next();
};

exports.getTours = catchAsync(async (req, res) => {
    const apiFeatures = new ApiFeatures(Tour.find(), req.query);
    apiFeatures.filter().sort().limitFields().paginate();
    const tours = await apiFeatures.query;
    res
      .status(200)
      .json({ status: 'success', result: tours.length, data: { tours } });
  }) 

exports.createTour = catchAsync(async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({path: 'reviews'});
  if (!tour) {
    return next(new AppError('A tour with such an ID was not found', 404));
  }
  res.status(200).send({
    status: 'success',
    data: {
      tour
    },
  });
});

exports.updateTourById = async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('A tour with such an ID in not found', 404));
  }
  res.status(200).send({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.deleteTour = deleteOne(Tour)

exports.getToursStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 3 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        ratingsQuantity: { $sum: '$ratingsQuantity' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res
    .status(200)
    .json({ status: 'success', result: stats.length, data: { stats } });
});

exports.getMonthPlan = catchAsync(async (req, res) => {
  const year = req.params.year;
  const monthPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numToursStarts: -1 } },
    { $limit: 12 },
  ]);
  res.status(200).json({
    status: 'success',
    data: { monthPlan },
  });
});
