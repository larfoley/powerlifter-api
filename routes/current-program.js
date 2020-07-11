const router = require('express').Router();
const WorkoutProgramModel = require('../models/WorkoutProgram');

router.get('/', async (req, res, next) => {
  const currentProgram = await WorkoutProgramModel.findOne();

  res.json({ currentProgram })
})

module.exports = router;
