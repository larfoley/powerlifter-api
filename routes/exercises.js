const router = require('express').Router();
const ExerciseModel = require('../models/Exercise');

router.get('/', async (req, res, next) => {
  try {
    // TODO: Seed exercises to database
    const exercises = [{ _id: 1, name: "Squat" }, { _id: 2, name: "Bench" }, { _id: 3, name: "Deadlift" }]

    res.status(200).json({ exercises })

  } catch(error) {
    next(error)
  }
});




module.exports = router;
