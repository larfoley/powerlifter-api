const ObjectId = require('mongoose').Types.ObjectId;

const newLiftRecord = {
  weightLifted: 100,
  reps: 1,
  exercise: {
    name: 'Deadlift'
  },
  date: "Sun Aug 02 2020 16:29:47 GMT+0100 (Irish Standard Time)",
}

const liftRecords = [
  {
    _id: ObjectId().toString(),
    weightLifted: 100,
    reps: 1,
    exercise: {
      name: 'Deadlift'
    },
    date: "Sun Aug 02 2020 16:29:47 GMT+0100 (Irish Standard Time)"
  },
  {
    _id: ObjectId().toString(),
    weightLifted: 50,
    reps: 5,
    exercise: {
      name: 'Squat'
    },
    date: "Sun Aug 02 2020 16:29:47 GMT+0100 (Irish Standard Time)"
  }
]

module.exports = {
  liftRecords,
  newLiftRecord
}
