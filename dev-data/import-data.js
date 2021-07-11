const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

dotenv.config({ path: './../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => console.log(err));

const tours = JSON.parse(fs.readFileSync('./data/tours.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

const deleteAllDocuments = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('All documents were deleted');
  } catch (err) {
    console.log(err);
  }
};

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data was imported');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  console.log(process.argv);
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllDocuments();
}
