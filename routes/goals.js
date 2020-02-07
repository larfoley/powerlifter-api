const router = require('express').Router();
const GoalService = require('../services/Goal');

const goalService = new GoalService();

router.get('/', async (req, res, next) => {
  try {
    const goals = await goalService.findAll();

    res.status(200).json({ goals })

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async ({ params }, res, next) => {
  const { id } = params;

  try {
    const goal = await goalService.findById(id);

    res.status(200).json({ goal })

  } catch(error) {
    next(error)
  }

});

router.post('/', async (req, res, next) => {
  const goal = new Goal(req.body);

  try {
    const goal = await goalService.create(goal);

    res.status(200).json({ goal })

  } catch(error) {
    next(error)
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  
  try {
    const goal = await goalService.update(id);

    res.status(200).json({ goal })

  } catch(error) {
    next(error)
  }
});

module.exports = router;
