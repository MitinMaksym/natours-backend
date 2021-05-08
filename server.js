const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

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

app.listen(port, '127.0.0.1', () => {
  console.log('App running on port ' + port);
});
