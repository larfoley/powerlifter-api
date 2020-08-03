const router = require('express').Router();
const escapeStringRegexp = require('escape-string-regexp');
const { ExerciseModel } = require('../models/Exercise');

router.get('/', async (req, res, next) => {
  const query = {};

  if (req.query.exercise) {
    const exercise = escapeStringRegexp(req.query.exercise);

    query['name'] = new RegExp(exercise, 'i')
  }

  try {
    const exercises = await ExerciseModel.find(query);

    res.status(200).json({ exercises });

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const exercise = await ExerciseModel.findById(req.params.id);

    res.status(200).json({ exercise });

  } catch(error) {
    next(error)
  }
});

module.exports = router;
