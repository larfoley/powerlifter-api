const router = require('express').Router();
const GoalModel = require('../models/Goal');
const LiftRecordModel = require('../models/LiftRecord');
const createError = require('http-errors');
const requestQuery = require('../middlewares/request-query');

router.get('/', requestQuery({
  allowedQueryParams: [
    'isCompleted',
    'exercise',
    'reps',
    'weight',
    'after',
  ]
}), async (req, res, next) => {
  const query = req.requestQuery;
  const limit = req.query.limit || 0;

  if (query.exercise) {
    query['exercise.name'] = query.exercise;
    delete query.exercise
  }

  if (query.after) {
    query['date'] = {"$gte": query.after }
  }

  try {
    const goals = await GoalModel.find(query).limit(limit);

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
      update.completedOn = new Date()
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
