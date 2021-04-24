const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./routes/toursRoutes');
const usersRoute = require('./routes/usersRoutes');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

/// ROUTES
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', usersRoute);

module.exports = app;
