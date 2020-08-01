const router = require('express').Router();
const requestQuery = require('../middlewares/request-query');
const exercisesController = require('../controllers/exercises-controller');

const {
  getExercises,
  getExercise
} = exercisesController;

router.get('/', getExercises);
router.get('/:id', getExercise);

module.exports = router;
