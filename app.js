const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
var cors = require('cors');
const cookieParser = require('cookie-parser');

const tourRoute = require('./routes/tourRoutes');
const usersRoute = require('./routes/userRoutes');
const reviewsRoute = require('./routes/reviewRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//GLOBAL MIDDLEWARES

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: true, credentials: true }));
//Security http headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

//Development loging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Please try again in an hour',
});
app.use('/app', limiter);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
//Body parser. Reading data from body into req.body
app.use(express.json());

app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

/// ROUTES
app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/reviews', reviewsRoute);
app.all('*', (req, res, next) => {
  next(new AppError(`Path ${req.originalUrl} was not found`, 404)); // if we pass a parameter to next that means there is an error
});

app.use(errorController);

module.exports = app;
// npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
