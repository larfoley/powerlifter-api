const router = require('express').Router();
const GoalModel = require('../models/Goal');

router.get('/', async (req, res, next) => {
  try {
    const goals = await GoalModel.find({});

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
  const goal = new GoalModel(req.body.goal);

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
    const goal = await GoalModel.findOneAndUpdate(id, update);

    res.status(200).json({ goal })

  } catch(error) {
    next(error)
  }
});

module.exports = router;
