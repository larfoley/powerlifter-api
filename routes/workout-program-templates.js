const router = require('express').Router();
const WorkoutProgramTemplateModel = require('../models/WorkoutProgramTemplate');
const UserModel = require('../models/User');

router.get('/', async (req, res, next) => {
  const workoutProgramTemplateIds = req.query.ids ? req.query.ids : [];
  const query = {};
  const author = req.query.author;
  console.log(req.query);

  if (author) {
    query.author = author;
  }

  if (workoutProgramTemplateIds.length > 0) {
    query._id = { $in: workoutProgramTemplateIds };
  }

  try {
    const workoutProgramTemplates = await WorkoutProgramTemplateModel.find(query);

    res.status(200).json({ workoutProgramTemplates });

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {

  try {
    const workoutProgramTemplate = await WorkoutProgramTemplateModel.findById(req.params.id);

    res.status(200).json({ workoutProgramTemplate });

  } catch(error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const requestBody = req.body.workoutProgramTemplate;

  const workoutProgramTemplate = new WorkoutProgramTemplateModel(requestBody);
  const currentUser = await UserModel.findById(req.user._id);

  try {
    await workoutProgramTemplate.save();

    currentUser.workoutProgramTemplates.push(workoutProgramTemplate);
    await currentUser.save();

    res.status(200).json({ workoutProgramTemplate })

  } catch(error) {
    next(error)
  }
});

router.delete('/:id', async (req, res, next) => {

  try {
    const currentUser = await UserModel.findById(req.user._id);

    currentUser.workoutProgramTemplates.pull({_id: req.params.id});

    await currentUser.save();
    const workoutProgramTemplate = await WorkoutProgramTemplateModel.findByIdAndDelete(req.params.id);

    res.status(200).json({});

  } catch(error) {
    next(error)
  }
});

module.exports = router;
