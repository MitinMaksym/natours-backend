const Tour = require('../models/toursModel');

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
class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    let queryObj = { ...this.queryObj };
    const excludedFields = ['sort', 'limit', 'page', 'filter', 'fields'];
    excludedFields.forEach((f) => delete queryObj[f]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryObj.sort) {
      const sortedBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortedBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryObj.fields) {
      const limitFields = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(limitFields);
    }
    return this;
  }
  paginate() {
    const page = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'price ratingsAverage summary';
  next();
};
exports.getTours = async (req, res) => {
  try {
    const apiFeatures = new ApiFeatures(Tour.find(), req.query);
    apiFeatures.filter().sort().limitFields().paginate();
    const tours = await apiFeatures.query;
    res
      .status(200)
      .json({ status: 'success', result: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.updateTourById = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getToursStats = async (req, res) => {
  try {
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
      { $match: { minPrice: { $lte: 500 } } },
    ]);

    res
      .status(200)
      .json({ status: 'success', result: stats.length, data: { stats } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.getMonthPlan = async (req, res) => {
  try {
    const year = req.params.year;
    console.log(year);
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
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
