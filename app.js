const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Some data' });
});

app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint');
});

const port = 3000;

app.listen(port, '127.0.0.1', () => {
  console.log('App running on port ' + port);
});
