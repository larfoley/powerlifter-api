const router = require('express').Router();
const goalsController = require('../controllers/goals-controller');
const requestQuery = require('../middlewares/request-query');

const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal
} = goalsController;

router.get('/',
  requestQuery({
    allowedQueryParams: [
      'isCompleted',
      'exercise',
      'reps',
      'weight',
      'after',
    ]
  }),
  getGoals
);
router.get('/:id', getGoal);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
