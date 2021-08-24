const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err,
    });
  }

  res
    .status(err.statusCode)
    .render('error', { title: 'Opps,something went wrong', msg: err.message });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    }
    console.error('Error', err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong' });
  }

  if (err.isOperational) {
    return res.render('error', {
      title: 'Opps,something went wrong',
      msg: err.message,
    });
  }
  res.render('error', {
    title: 'Opps, something went wrong',
    msg: 'Please try again later',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value "${err.keyValue.name}". Please use another value`;
  return new AppError(message, 400);
};

const handleDValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Token is invalid. Please try to login again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError(
    'Your token has expired. Please try to log in again',
    401
  );
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.stack.startsWith('CastError')) error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleDValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
