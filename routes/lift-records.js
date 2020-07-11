require('dotenv').config();
const router = require('express').Router();
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const LiftRecordModel = require('../models/LiftRecord');

router.get('/', async (req, res, next) => {

  const { exercise, limit, ...query } = req.query;

  if (exercise) {
    query['exercise.name'] = exercise;
  }

  try {
    const liftRecords = await LiftRecordModel.find(query).limit(parseInt(limit));

    res.status(200).json({ liftRecords })

  } catch(error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const liftRecord = await new LiftRecordModel(req.body.liftRecord).save();

    await LiftRecordModel.updatePersonalBests(liftRecord.exercise.name, liftRecord.reps);

    const query = {
      'exercise.name': liftRecord.exercise.name,
      isCompleted: false,
      hasPreviouslyAchievedGoal: false,
      reps: liftRecord.reps,
      weight: { $lte: liftRecord.weightLifted }
    }

    const query2 = {
      'exercise.name': liftRecord.exercise.name,
      isCompleted: false,
      hasPreviouslyAchievedGoal: true,
      reps: liftRecord.reps,
      weight: { $lte: liftRecord.weightLifted },
      createdAt: { $gte: liftRecord.createdAt }
    }

    // await GoalModel.updateMany(query, {
    //   isCompleted: true,
    //   percentageCompleted: 100
    // })
    //
    // await GoalModel.updateMany(query2, {
    //   isCompleted: true,
    //   percentageCompleted: 100
    // })

    res.status(200).json({ liftRecord })

  } catch(error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const liftRecord = await LiftRecordModel.findById(id);

    res.status(200).json({ liftRecord })

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const liftRecord = await LiftRecordModel.findById(id);


    res.status(200).json({ liftRecord })

  } catch(error) {
    next(error)
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const liftRecord = await LiftRecordModel.findByIdAndUpdate(id, req.body.liftRecord, { new: true });
    const exercise = liftRecord.exercise.name;
    const reps = liftRecord.reps;

    await LiftRecordModel.updatePersonalBests(exercise, reps);
    await GoalModel.findOne({ 'exercise.name': exercise, reps});

    res.status(200).json({ liftRecord })

  } catch(error) {
    next(error)
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const goal = await LiftRecordModel.findOneAndDelete(id);

    res.status(200).json({})

  } catch(error) {
    next(error)
  }
});


module.exports = router;
