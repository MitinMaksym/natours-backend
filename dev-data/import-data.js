const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../models/toursModel');
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

const data = JSON.parse(fs.readFileSync('./data/tours-simple.json', 'utf-8'));

const deleteAllDocuments = async () => {
  try {
    await Tour.deleteMany();
    console.log('All documents were deleted');
  } catch (err) {
    console.log(err);
  }
};

const importData = async () => {
  try {
    await Tour.create(data);
    console.log('Data was imported');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllDocuments();
}
