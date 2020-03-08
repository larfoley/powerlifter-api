const router = require('express').Router();
const PersonalBest = require('../models/PersonalBest');
const createError = require('http-errors');

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
      return next(createError(404));
    }

    return new PersonalBest(params);
  });
});

module.exports = router;
