const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: `${__dirname}/config.env` });

process.on('uncaughtException',err => {
  console.log(err.name, err.message)
  console.error('Unhandled exception', 'Shutting down...')
    process.exit(1)
})

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

const server = app.listen(port, '127.0.0.1', () => {
  console.log('App running on port ' + port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message)
  console.error('Unhandled rejection', 'Shutting down...')
  server.close(() => {
    process.exit(1)
  })
})
