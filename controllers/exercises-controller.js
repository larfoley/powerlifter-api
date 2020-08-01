const { ExerciseModel } = require('../models/Exercise');
const escapeStringRegexp = require('escape-string-regexp');

class ExercisesController {

  async getExercises(req, res) {
    const query = {};

    if (req.query.exercise) {
      const exercise = escapeStringRegexp(req.query.exercise);

      query['name'] = new RegExp(exercise, 'i')
    }

    try {
      const exercises = await ExerciseModel.find(query);

      res.json({ exercises });

    } catch(error) {
      next(error)
    }
  }

  async getExercise(req, res, next) {
    try {
      const exercise = await ExerciseModel.findById(req.params.id);

      res.json({ exercise });

    } catch(error) {
      next(error)
    }
  };

}

module.exports = new ExercisesController();
