const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('A doocument with such an ID in not found', 404));
    }
    res.status(204).json({ status: 'success', data: null });
  });


  exports.updateOne = Model =>
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
          data:doc,
        },
      });
    });


