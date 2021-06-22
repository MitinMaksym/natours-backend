const express = require('express');
const rateLimit = require('express-rate-limit')
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');

const tourRoute = require('./routes/toursRoutes');
const usersRoute = require('./routes/usersRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 300,
  windowMs:60 * 60 * 1000,
  message: 'Too many requests. Please try again in an hour'
})
app.use(limiter)
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

/// ROUTES
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', usersRoute);
app.all('*', (req, res, next) => {
  next(new AppError(`Path ${req.originalUrl} was not found`, 404)); // if we pass a parameter to next that means there is an error
});

app.use(errorController);

module.exports = app;
// npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
