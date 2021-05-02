const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: `${__dirname}/config.env` });
const port = process.env.PORT || 3000;

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

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name should be provided'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', toursSchema);

const newTour = new Tour({ name: 'Sea Observer', price: 333 });
newTour
  .save()
  .then((data) => console.log(data))
  .catch((e) => console.log(e));

app.listen(port, '127.0.0.1', () => {
  console.log('App running on port ' + port);
});
