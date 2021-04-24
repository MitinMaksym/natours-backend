const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', result: tours.length, data: { tours } });
};

exports.createTour = (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = { id: newTourId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).send({ status: 'success', data: { tour: newTour } });
    }
  );
};

exports.getTourById = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).send({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTourById = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).send({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTourById = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(204).send({
    status: 'success',
    data: null,
  });
};
