const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./routes/toursRoutes');
const usersRoute = require('./routes/usersRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

/// ROUTES
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', usersRoute);

module.exports = app;
// npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
