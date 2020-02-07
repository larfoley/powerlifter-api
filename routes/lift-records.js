const router = require('express').Router();
const LiftRecordModel = require('../models/LiftRecord');

router.get('/', async (req, res, next) => {

  try {
    const liftRecords = await LiftRecordModel.find({});
  
    res.status(200).json({ liftRecords })

  } catch(error) {
    next(error);

  }
});


module.exports = router;