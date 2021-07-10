const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError('A doocument with such an ID in not found', 404)
      );
    }
    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('A document with such an ID in not found', 404));
    }
    res.status(200).send({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(
        new AppError('A document with such an ID was not found', 404)
      );
    }
    res.status(200).send({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // to allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { id: req.params.tourId };
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query);
    apiFeatures.filter().sort().limitFields().paginate();
    const docs = await apiFeatures.query;
    res
      .status(200)
      .json({ status: 'success', result: docs.length, data: { data: docs } });
  });
