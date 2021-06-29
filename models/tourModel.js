const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, 'Such a name already exists'],
      required: [true, 'Name should be provided'],
      minLength: [10, 'Name must contain at least 10 characters'],
      maxLength: [40, 'Name must have less or equal than 40 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'RatingsAverage must be greater or equal 1'],
      max: [5, 'RatingsAverage must be less or equal 5'],
      default: 4,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // This only works during creation of a new document
          return val < this.price;
        },
        message: 'Discount must be less than price',
      },
    },
    description: String,
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],

    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        address: String,
        description: String,
        coordinates: [Number],
      },
    ],
    guides: Array,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs after and before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id))
  this.guides = await Promise.all(guidesPromises)
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = new Date();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(docs);
//   console.log(`The request took ${new Date() - this.start}`);
//   next();
// });

tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
