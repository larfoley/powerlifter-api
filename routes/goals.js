const router = require('express').Router();
const Goal = require('../models/Goal');
const createError = require('../utils/create-error');

router.get('/', (req, res, next) => {
  Goal.find({}, (err, goals) => {
    if (err) {
      return next(err);
    }

    res.json({ goals });
  });
});

router.get('/:id', ({ params }, res, next) => {
  const { id } = params;

  Goal.findById(id, (err, goal) => {
    if (!goal) {
      return next(createError(404, 'Not found'))
    }

    res.json({ goal });
  });
});

router.post('/', async (req, res, next) => {
  const goal = new Goal(req.body);

  try {
    await goal.save();
    res.json(goal);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json(error);
    }

    next(error);
  }
});

router.put('/:id', async ({ params }, res, next) => {
  Goal.findByIdAndUpdate(params.id, params, (error, goal) => {
    if (error) {
      if (error.name === 'ValidationError') {
        res.state(422).json({ error });
      }

      return next(error);
    }

    res.json({ goal });
  });
});

module.exports = router;
