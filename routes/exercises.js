const router = require('express').Router();
const { ExerciseModel } = require('../models/Exercise');

router.get('/', async (req, res, next) => {
  try {
    const exercises = await ExerciseModel.find({});

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
