const LiftRecordModel = require('../models/LiftRecord');
const s3 = require('../services/s3');

class LiftRecordsController {

  async getLiftRecords(req, res, next) {
    const { exercise } = req.query;
    const limit = req.query.limit || 0
    const findQuery = { _id: req.user._id };

    if (exercise) {
      findQuery['exercise.name'] = exercise;
    }

    try {
      const liftRecords = await LiftRecordModel.find(findQuery)
        .limit(parseInt(limit))
        .sort('-createdAt');

      res.status(200).json({ liftRecords })

    } catch(error) {
      next(error);
    }
  }

  async getLiftRecord(req, res, next) {
    const id = req.params.id;

    try {
      const liftRecord = await LiftRecordModel.findById(id);

      res.status(200).json({ liftRecord })

    } catch(error) {
      next(error)
    }
  };

  async updateLiftRecord(req, res, next) {
    const id = req.params.id;

    try {
      const liftRecord = await LiftRecordModel.findByIdAndUpdate(id, req.body.liftRecord, { new: true });
      const exercise = liftRecord.exercise.name;
      const reps = liftRecord.reps;

      await LiftRecordModel.updatePersonalBests(exercise, reps);

      res.status(200).json({ liftRecord })

    } catch(error) {
      next(error)
    }
  };

  async deleteLiftRecord(req, res, next) {
    const id = req.params.id;

    try {

      const liftRecord = await LiftRecordModel.findOneAndDelete(id);

      if (liftRecord.videoURL) {
        await s3.deleteObject({
          Key: post.media.url
        });
      }

      res.status(200).json({})

    } catch(error) {
      next(error)
    }
  };

  async createLiftRecord(req, res, next) {
    try {
      const liftRecord = await new LiftRecordModel(req.body.liftRecord).save();

      // await LiftRecordModel.updatePersonalBests(liftRecord.exercise.name, liftRecord.reps);

      res.status(201).json({ liftRecord })

    } catch(error) {
      next(error);
    }
  }
}

module.exports = new LiftRecordsController();
