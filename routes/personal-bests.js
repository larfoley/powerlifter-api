const router = require('express').Router();
const PersonalBest = require('../models/PersonalBest');

const createError = () => {
  const error = new Error();
  error.message = 'Not Found';
  error.status = 404;
  return error;
};

router.get('/', (req, res, next) => {
  PersonalBest.find({}, (err, users) => {
    if (err) return next(err);
    return res.json({ users });
  });
});

router.get('/:id', ({ params }, res, next) => {
  const { id } = params;

  PersonalBest.findById(id, (err, pb) => {
    if (!pb) {
      return next(createError('Not found', 404));
    }

    return new PersonalBest(params);
  });
});

module.exports = router;
