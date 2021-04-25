const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  const tour = tours.find((tour) => tour.id === +val);
  console.log(tour);
  if (!tour) {
    console.log(5);

    return res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .send({ status: 'fail', message: 'Price or name was not provided' });
  }
  next();
};
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
  const tour = tours.find((tour) => tour.id === +req.params.id);

  res.status(200).send({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTourById = (req, res) => {
  const tour = tours.find((tour) => tour.id === id);
  res.status(200).send({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTourById = (req, res) => {
  res.status(204).send({
    status: 'success',
    data: null,
  });
};
