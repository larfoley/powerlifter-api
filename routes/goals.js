const router = require('express').Router();
const GoalModel = require('../models/Goal');
const LiftRecordModel = require('../models/LiftRecord');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
  const exercise = req.query.exercise;
  const query = {
    user: req.user._id
  };

  if (exercise) {
    query['exercise.name'] = exercise;
  }

  try {

    const goals = await GoalModel.find(query);

    // get all records where exercise is x and reps is y
    // LiftRecords.find({ exercise: 10 }) // 'this' now refers to the Member class
    //  .sort('-score')
    //  .exec(callback);

    // console.log(GoalModel);

    res.status(200).json({ goals })

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const goal = await GoalModel.findById(id);


    res.status(200).json({ goal })

  } catch(error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const goal = new GoalModel({
    ...req.body.goal,
    user: req.user._id
  });

  try {
    await goal.save();

    res.status(200).json({ goal })

  } catch(error) {
    next(error)
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const update = req.body.goal;

  try {
    if (update.isCompleted) {
      update.percentageCompleted = 100;

    } else {
      const percentageCompleted = await GoalModel.getPercentageCompleted(update);

      update.percentageCompleted = percentageCompleted;

      if (percentageCompleted >= 100) {
        update.isCompleted = true;
      }
    }

    // const goal =
    const goal = await GoalModel.findById(id);

    // Check if goal is being updated to completed
    if (update.isCompleted && !goal.isCompleted) {
      console.log("marking complete");

        const liftRecord = new LiftRecordModel({
          reps: goal.reps,
          weightLifted: goal.weight,
          'exercise.name': goal.exercise.name,
          date: new Date(),
        })

        await liftRecord.save();
    }

    const updatedGoal = await GoalModel.findByIdAndUpdate(id, update, { new: true });

    res.status(200).json({ goal: updatedGoal })

  } catch(error) {
    next(error)
  }
});


router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const goal = await GoalModel.findOneAndDelete(id);

    res.status(200).json({})

  } catch(error) {
    next(error)
  }
});

module.exports = router;
