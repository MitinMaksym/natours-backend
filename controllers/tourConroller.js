const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sharp = require('sharp');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');
const multer = require('multer');

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

const multerStorage = multer.memoryStorage(); // files will be available in buffer

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (image, idx) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${idx + 1}.jpeg`;
      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${fileName}`);

      req.body.images.push(fileName);
    })
  );

  next();
});
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'price ratingsAverage summary';
  next();
};

//TODO calculation reviews

exports.getTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

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
