const router = require('express').Router();
const liftRecordsController = require('../controllers/lift-records-controller');
const requestQuery = require('../middlewares/request-query');

const {
  getLiftRecords,
  getLiftRecord,
  createLiftRecord,
  updateLiftRecord,
  deleteLiftRecord
} = liftRecordsController;

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
  getLiftRecords
);
router.get('/:id', getLiftRecord);
router.post('/', createLiftRecord);
router.put('/:id', updateLiftRecord);
router.delete('/:id', deleteLiftRecord);

module.exports = router;
