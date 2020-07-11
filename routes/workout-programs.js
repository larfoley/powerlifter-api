const router = require('express').Router();
const WorkoutProgramModel = require('../models/WorkoutProgram');
const UserModel = require('../models/User');


const requestQuery = (options = { allowedQueryParams: [] }) => {
  const { allowedQueryParams } = options;

  return function(req, res, next) {
    const query = {};

    try {
      for (var key in req.query) {
        if (allowedQueryParams.includes(key)) {
          const queryValue = req.query[key];

          if (typeof queryValue === "array" && queryValue.length > 0) {
            query._id = { $in: queryValue };
          }

          query[key] = req.query[key];
        }
      }

      req.reqQuery = query;

      return next();

    } catch (e) {
        next(e);
    }
  }
}

router.get('/', async (req, res, next) => {
  const workoutProgramIds = req.query.ids ? req.query.ids : [];
  const query = {};
  const author = req.query.author;

  if (author) {
    query.author = author;
  }

  if (workoutProgramIds.length > 0) {
    query._id = { $in: workoutProgramIds };
  }

  if (req.query.isActive) {
    query.isActive = query.isActive;
  }

  try {
    const workoutPrograms = await WorkoutProgramModel.find(query);

    res.status(200).json({ workoutPrograms });

  } catch(error) {
    next(error);
  }
});

router.get('/active', async (req, res, next) => {

  try {
    const workoutProgram = await WorkoutProgramModel.findOne({
      user: req.user._id
    });

    res.status(200).json({ workoutProgram });

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {

  try {
    const workoutProgram = await WorkoutProgramModel.findById(req.params.id);

    res.status(200).json({ workoutProgram });

  } catch(error) {
    next(error)
  }
});

router.put('/:id', async (req, res, next) => {
  const update = req.body.workoutProgram;
  
  try {
    const workoutProgram = await WorkoutProgramModel.findByIdAndUpdate(req.params.id, update, { new: true });

    res.status(200).json({ workoutProgram });

  } catch(error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const requestBody = req.body.workoutProgram;

  const workoutProgram = new WorkoutProgramModel(requestBody);
  const currentUser = await UserModel.findById(req.user._id);

  try {
    await workoutProgram.save();

    currentUser.workoutHistory.push(workoutProgram);
    await currentUser.save();

    res.status(200).json({ workoutProgram })

  } catch(error) {
    next(error)
  }
});

router.delete('/:id', async (req, res, next) => {

  try {
    const workoutProgram = await WorkoutProgramModel.findByIdAndDelete(req.params.id);

    res.status(200).json({});

  } catch(error) {
    next(error)
  }
});

module.exports = router;
